import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ActionService,
  GetTargetRequestSchema,
  GetTargetResponseSchema,
} from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { actionGetTargetRequestParse } from "../src/v2/actionGetTargetRequestParse.js"
import { actionServiceGetTarget } from "../src/v2/actionServiceGetTarget.js"

describe("ActionService.GetTarget", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await actionGetTargetRequestParse({
      json: JSON.stringify({ id: "target-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.id).toBe("target-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(GetTargetResponseSchema, {
      target: { id: "target-1", name: "Example", endpoint: "https://example.test/action" },
    })

    const jsonResult = messageSerialize(GetTargetResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      target: { id: "target-1", name: "Example", endpoint: "https://example.test/action" },
    })

    const yamlResult = messageSerialize(GetTargetResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      target: { id: "target-1", name: "Example", endpoint: "https://example.test/action" },
    })
  })

  test("returns transport failures as Result errors", async () => {
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async () => {
        throw new Error("request failed")
      },
    } as Transport

    const result = await actionServiceGetTarget({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { id: "target-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "actionServiceGetTarget",
      errorMessage: "request failed",
    })
  })

  test("returns the typed get response from the Connect client", async () => {
    const response = create(GetTargetResponseSchema, {
      target: { id: "target-1", name: "Example", endpoint: "https://example.test/action" },
    })
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async () => ({
        header: new Headers(),
        message: response,
        service: ActionService,
        stream: false,
        trailer: new Headers(),
      }),
    } as unknown as Transport

    const result = await actionServiceGetTarget({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { id: "target-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.target?.id).toBe("target-1")
  })

  test("adds the bearer token to Connect requests", async () => {
    const request = { header: new Headers() } as unknown as UnaryRequest
    const next = async (received: UnaryRequest | StreamRequest): Promise<UnaryResponse> => {
      expect(received.header.get("Authorization")).toBe("Bearer bearer-token")
      return {} as UnaryResponse
    }

    await zitadelBearerInterceptorCreate("bearer-token")(next)(request)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(GetTargetRequestSchema.typeName).toBe("zitadel.action.v2.GetTargetRequest")
    expect(GetTargetResponseSchema.typeName).toBe("zitadel.action.v2.GetTargetResponse")
    expect(ActionService.methods.find(({ localName }) => localName === "getTarget")?.name).toBe("GetTarget")
  })
})

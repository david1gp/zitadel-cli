import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ActionService,
  CreateTargetRequestSchema,
  CreateTargetResponseSchema,
} from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { actionCreateTargetRequestParse } from "../src/v2/actionCreateTargetRequestParse.js"
import { actionServiceCreateTarget } from "../src/v2/actionServiceCreateTarget.js"

describe("ActionService.CreateTarget", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await actionCreateTargetRequestParse({
      json: JSON.stringify({
        endpoint: "https://example.test/action",
        name: "Example",
        payloadType: "PAYLOAD_TYPE_JSON",
        restWebhook: { interruptOnError: true },
        timeout: "10s",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.name).toBe("Example")
    expect(result.data.endpoint).toBe("https://example.test/action")
    expect(result.data.payloadType).toBe(1)
    expect(result.data.timeout?.seconds).toBe(10n)
    const targetType = result.data.targetType
    if (targetType === undefined || targetType.case !== "restWebhook" || targetType.value === undefined) {
      return
    }
    expect(targetType.case).toBe("restWebhook")
    expect(targetType.value.interruptOnError).toBe(true)
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(CreateTargetResponseSchema, {
      id: "target-1",
      signingKey: "signing-key",
    })

    const jsonResult = messageSerialize(CreateTargetResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ id: "target-1", signingKey: "signing-key" })

    const yamlResult = messageSerialize(CreateTargetResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ id: "target-1", signingKey: "signing-key" })
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

    const result = await actionServiceCreateTarget({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "actionServiceCreateTarget",
      errorMessage: "request failed",
    })
  })

  test("returns the typed create response from the Connect client", async () => {
    const response = create(CreateTargetResponseSchema, {
      id: "target-1",
      signingKey: "signing-key",
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

    const result = await actionServiceCreateTarget({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        endpoint: "https://example.test/action",
        name: "Example",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.id).toBe("target-1")
    expect(result.data.signingKey).toBe("signing-key")
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
    expect(CreateTargetRequestSchema.typeName).toBe("zitadel.action.v2.CreateTargetRequest")
    expect(CreateTargetResponseSchema.typeName).toBe("zitadel.action.v2.CreateTargetResponse")
    expect(ActionService.methods.find(({ localName }) => localName === "createTarget")?.name).toBe("CreateTarget")
  })
})

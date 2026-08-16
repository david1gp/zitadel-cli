import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ActionService,
  ListExecutionMethodsRequestSchema,
  ListExecutionMethodsResponseSchema,
} from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { actionListExecutionMethodsRequestParse } from "../src/v2/actionListExecutionMethodsRequestParse.js"
import { actionServiceListExecutionMethods } from "../src/v2/actionServiceListExecutionMethods.js"

describe("ActionService.ListExecutionMethods", () => {
  test("parses the empty generated protobuf JSON request", async () => {
    const result = await actionListExecutionMethodsRequestParse({ json: "{}" })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data).toEqual({ $typeName: "zitadel.action.v2.ListExecutionMethodsRequest" })
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListExecutionMethodsResponseSchema, {
      methods: ["request.user.id", "request.organization.id"],
    })

    const jsonResult = messageSerialize(ListExecutionMethodsResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      methods: ["request.user.id", "request.organization.id"],
    })

    const yamlResult = messageSerialize(ListExecutionMethodsResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      methods: ["request.user.id", "request.organization.id"],
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

    const result = await actionServiceListExecutionMethods({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "actionServiceListExecutionMethods",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListExecutionMethodsResponseSchema, {
      methods: ["request.user.id"],
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

    const result = await actionServiceListExecutionMethods({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.methods).toEqual(["request.user.id"])
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
    expect(ListExecutionMethodsRequestSchema.typeName).toBe("zitadel.action.v2.ListExecutionMethodsRequest")
    expect(ListExecutionMethodsResponseSchema.typeName).toBe("zitadel.action.v2.ListExecutionMethodsResponse")
    expect(ActionService.methods.find(({ localName }) => localName === "listExecutionMethods")?.name).toBe(
      "ListExecutionMethods",
    )
  })
})

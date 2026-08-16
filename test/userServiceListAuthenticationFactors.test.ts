import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ListAuthenticationFactorsRequestSchema,
  ListAuthenticationFactorsResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userListAuthenticationFactorsRequestParse } from "../src/v2/userListAuthenticationFactorsRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceListAuthenticationFactors } from "../src/v2/userServiceListAuthenticationFactors.js"

describe("UserService.ListAuthenticationFactors", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userListAuthenticationFactorsRequestParse({
      json: JSON.stringify({ userId: "user-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListAuthenticationFactorsResponseSchema, {
      result: [{ type: { case: "otp", value: {} } }],
    })

    const jsonResult = messageSerialize(ListAuthenticationFactorsResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ result: [{ otp: {} }] })

    const yamlResult = messageSerialize(ListAuthenticationFactorsResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ result: [{ otp: {} }] })
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

    const result = await userServiceListAuthenticationFactors({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceListAuthenticationFactors",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListAuthenticationFactorsResponseSchema, {
      result: [],
    })
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async () => ({
        header: new Headers(),
        message: response,
        service: UserService,
        stream: false,
        trailer: new Headers(),
      }),
    } as unknown as Transport

    const result = await userServiceListAuthenticationFactors({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.result).toEqual([])
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
    expect(ListAuthenticationFactorsRequestSchema.typeName).toBe("zitadel.user.v2.ListAuthenticationFactorsRequest")
    expect(ListAuthenticationFactorsResponseSchema.typeName).toBe("zitadel.user.v2.ListAuthenticationFactorsResponse")
    expect(UserService.methods.find(({ localName }) => localName === "listAuthenticationFactors")?.name).toBe(
      "ListAuthenticationFactors",
    )
  })
})

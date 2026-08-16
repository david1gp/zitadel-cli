import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  VerifyPhoneRequestSchema,
  VerifyPhoneResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceVerifyPhone } from "../src/v2/userServiceVerifyPhone.js"
import { userVerifyPhoneRequestParse } from "../src/v2/userVerifyPhoneRequestParse.js"

describe("UserService.VerifyPhone", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userVerifyPhoneRequestParse({
      json: JSON.stringify({
        userId: "user-1",
        verificationCode: "123456",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.verificationCode).toBe("123456")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(VerifyPhoneResponseSchema, {})

    const jsonResult = messageSerialize(VerifyPhoneResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(VerifyPhoneResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({})
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

    const result = await userServiceVerifyPhone({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        userId: "user-1",
        verificationCode: "123456",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceVerifyPhone",
      errorMessage: "request failed",
    })
  })

  test("returns the typed verify response from the Connect client", async () => {
    const response = create(VerifyPhoneResponseSchema, {})
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

    const result = await userServiceVerifyPhone({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        userId: "user-1",
        verificationCode: "123456",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toBe(response)
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
    expect(VerifyPhoneRequestSchema.typeName).toBe("zitadel.user.v2.VerifyPhoneRequest")
    expect(VerifyPhoneResponseSchema.typeName).toBe("zitadel.user.v2.VerifyPhoneResponse")
    expect(UserService.methods.find(({ localName }) => localName === "verifyPhone")?.name).toBe("VerifyPhone")
  })
})

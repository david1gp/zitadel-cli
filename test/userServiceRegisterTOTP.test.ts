import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  RegisterTOTPRequestSchema,
  RegisterTOTPResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userRegisterTOTPRequestParse } from "../src/v2/userRegisterTOTPRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceRegisterTOTP } from "../src/v2/userServiceRegisterTOTP.js"

describe("UserService.RegisterTOTP", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userRegisterTOTPRequestParse({
      json: JSON.stringify({ userId: "user-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(RegisterTOTPResponseSchema, {
      secret: "test-secret",
      uri: "otpauth://totp/example:user-1",
    })

    const jsonResult = messageSerialize(RegisterTOTPResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      uri: "otpauth://totp/example:user-1",
      secret: "test-secret",
    })

    const yamlResult = messageSerialize(RegisterTOTPResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      uri: "otpauth://totp/example:user-1",
      secret: "test-secret",
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

    const result = await userServiceRegisterTOTP({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceRegisterTOTP",
      errorMessage: "request failed",
    })
  })

  test("returns the typed registration response from the Connect client", async () => {
    const response = create(RegisterTOTPResponseSchema, {
      secret: "test-secret",
      uri: "otpauth://totp/example:user-1",
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

    const result = await userServiceRegisterTOTP({
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
    expect(result.data.uri).toBe("otpauth://totp/example:user-1")
    expect(result.data.secret).toBe("test-secret")
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
    expect(RegisterTOTPRequestSchema.typeName).toBe("zitadel.user.v2.RegisterTOTPRequest")
    expect(RegisterTOTPResponseSchema.typeName).toBe("zitadel.user.v2.RegisterTOTPResponse")
    expect(UserService.methods.find(({ localName }) => localName === "registerTOTP")?.name).toBe("RegisterTOTP")
  })
})

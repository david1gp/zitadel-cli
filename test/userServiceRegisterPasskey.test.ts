import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  RegisterPasskeyRequestSchema,
  RegisterPasskeyResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userRegisterPasskeyRequestParse } from "../src/v2/userRegisterPasskeyRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceRegisterPasskey } from "../src/v2/userServiceRegisterPasskey.js"

describe("UserService.RegisterPasskey", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await userRegisterPasskeyRequestParse({
      json: JSON.stringify({
        authenticator: "PASSKEY_AUTHENTICATOR_PLATFORM",
        code: { code: "registration-code", id: "code-1" },
        domain: "example.com",
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.code?.id).toBe("code-1")
    expect(result.data.code?.code).toBe("registration-code")
    expect(result.data.authenticator).toBe(1)
    expect(result.data.domain).toBe("example.com")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(RegisterPasskeyResponseSchema, {
      passkeyId: "passkey-1",
      publicKeyCredentialCreationOptions: { challenge: "challenge-1" },
    })

    const jsonResult = messageSerialize(RegisterPasskeyResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      passkeyId: "passkey-1",
      publicKeyCredentialCreationOptions: { challenge: "challenge-1" },
    })

    const yamlResult = messageSerialize(RegisterPasskeyResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      passkeyId: "passkey-1",
      publicKeyCredentialCreationOptions: { challenge: "challenge-1" },
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

    const result = await userServiceRegisterPasskey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceRegisterPasskey",
      errorMessage: "request failed",
    })
  })

  test("returns the typed registration response from the Connect client", async () => {
    const response = create(RegisterPasskeyResponseSchema, { passkeyId: "passkey-1" })
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

    const result = await userServiceRegisterPasskey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        authenticator: 1,
        domain: "example.com",
        userId: "user-1",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.passkeyId).toBe("passkey-1")
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
    expect(RegisterPasskeyRequestSchema.typeName).toBe("zitadel.user.v2.RegisterPasskeyRequest")
    expect(RegisterPasskeyResponseSchema.typeName).toBe("zitadel.user.v2.RegisterPasskeyResponse")
    expect(UserService.methods.find(({ localName }) => localName === "registerPasskey")?.name).toBe("RegisterPasskey")
  })
})

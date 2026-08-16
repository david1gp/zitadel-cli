import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import {
  VerifyPasskeyRegistrationRequestSchema,
  VerifyPasskeyRegistrationResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceVerifyPasskeyRegistration } from "../src/v2/userServiceVerifyPasskeyRegistration.js"
import { userVerifyPasskeyRegistrationRequestParse } from "../src/v2/userVerifyPasskeyRegistrationRequestParse.js"

describe("UserService.VerifyPasskeyRegistration", () => {
  test("parses the generated protobuf JSON request", async () => {
    const publicKeyCredential = {
      id: "credential-1",
      response: {
        clientDataJSON: "client-data",
      },
    }
    const result = await userVerifyPasskeyRegistrationRequestParse({
      json: JSON.stringify({
        passkeyId: "passkey-1",
        passkeyName: "Laptop",
        publicKeyCredential,
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.passkeyId).toBe("passkey-1")
    expect(result.data.publicKeyCredential).toEqual(publicKeyCredential)
    expect(result.data.passkeyName).toBe("Laptop")
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

    const result = await userServiceVerifyPasskeyRegistration({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceVerifyPasskeyRegistration",
      errorMessage: "request failed",
    })
  })

  test("returns the typed generated response from the Connect client", async () => {
    const response = create(VerifyPasskeyRegistrationResponseSchema, {})
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

    const result = await userServiceVerifyPasskeyRegistration({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        passkeyId: "passkey-1",
        passkeyName: "Laptop",
        userId: "user-1",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data).toBe(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(VerifyPasskeyRegistrationRequestSchema.typeName).toBe("zitadel.user.v2.VerifyPasskeyRegistrationRequest")
    expect(VerifyPasskeyRegistrationResponseSchema.typeName).toBe("zitadel.user.v2.VerifyPasskeyRegistrationResponse")
    expect(UserService.methods.find(({ localName }) => localName === "verifyPasskeyRegistration")?.name).toBe(
      "VerifyPasskeyRegistration",
    )
  })
})

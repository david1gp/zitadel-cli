import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import {
  VerifyU2FRegistrationRequestSchema,
  VerifyU2FRegistrationResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceVerifyU2FRegistration } from "../src/v2/userServiceVerifyU2FRegistration.js"
import { userVerifyU2FRegistrationRequestParse } from "../src/v2/userVerifyU2FRegistrationRequestParse.js"

describe("UserService.VerifyU2FRegistration", () => {
  test("parses the generated protobuf JSON request", async () => {
    const publicKeyCredential = {
      id: "credential-1",
      response: {
        clientDataJSON: "client-data",
      },
    }
    const result = await userVerifyU2FRegistrationRequestParse({
      json: JSON.stringify({
        publicKeyCredential,
        tokenName: "Security key",
        u2fId: "u2f-1",
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.u2fId).toBe("u2f-1")
    expect(result.data.publicKeyCredential).toEqual(publicKeyCredential)
    expect(result.data.tokenName).toBe("Security key")
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

    const result = await userServiceVerifyU2FRegistration({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceVerifyU2FRegistration",
      errorMessage: "request failed",
    })
  })

  test("returns the typed generated response from the Connect client", async () => {
    const response = create(VerifyU2FRegistrationResponseSchema, {})
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

    const result = await userServiceVerifyU2FRegistration({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        publicKeyCredential: {
          id: "credential-1",
        },
        tokenName: "Security key",
        u2fId: "u2f-1",
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
    expect(VerifyU2FRegistrationRequestSchema.typeName).toBe("zitadel.user.v2.VerifyU2FRegistrationRequest")
    expect(VerifyU2FRegistrationResponseSchema.typeName).toBe("zitadel.user.v2.VerifyU2FRegistrationResponse")
    expect(UserService.methods.find(({ localName }) => localName === "verifyU2FRegistration")?.name).toBe(
      "VerifyU2FRegistration",
    )
  })
})

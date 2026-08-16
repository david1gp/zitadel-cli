import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import {
  RemovePasskeyRequestSchema,
  RemovePasskeyResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { userRemovePasskeyRequestParse } from "../src/v2/userRemovePasskeyRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceRemovePasskey } from "../src/v2/userServiceRemovePasskey.js"

describe("UserService.RemovePasskey", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userRemovePasskeyRequestParse({
      json: JSON.stringify({
        passkeyId: "passkey-1",
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.passkeyId).toBe("passkey-1")
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

    const result = await userServiceRemovePasskey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceRemovePasskey",
      errorMessage: "request failed",
    })
  })

  test("returns the typed generated response from the Connect client", async () => {
    const response = create(RemovePasskeyResponseSchema, {})
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

    const result = await userServiceRemovePasskey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        passkeyId: "passkey-1",
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
    expect(RemovePasskeyRequestSchema.typeName).toBe("zitadel.user.v2.RemovePasskeyRequest")
    expect(RemovePasskeyResponseSchema.typeName).toBe("zitadel.user.v2.RemovePasskeyResponse")
    expect(UserService.methods.find(({ localName }) => localName === "removePasskey")?.name).toBe("RemovePasskey")
  })
})

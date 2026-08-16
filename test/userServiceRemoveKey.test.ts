import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { usersRemoveKeyCommand } from "../src/cli/usersRemoveKeyCommand.js"
import { RemoveKeyRequestSchema, RemoveKeyResponseSchema } from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { userRemoveKeyRequestParse } from "../src/v2/userRemoveKeyRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceRemoveKey } from "../src/v2/userServiceRemoveKey.js"

describe("UserService.RemoveKey", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userRemoveKeyRequestParse({
      json: JSON.stringify({
        keyId: "key-1",
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.keyId).toBe("key-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(RemoveKeyResponseSchema, {})

    const jsonResult = messageSerialize(RemoveKeyResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(RemoveKeyResponseSchema, response, "yaml")
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

    const result = await userServiceRemoveKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        keyId: "key-1",
        userId: "user-1",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceRemoveKey",
      errorMessage: "request failed",
    })
  })

  test("returns the typed generated response from the Connect client", async () => {
    const response = create(RemoveKeyResponseSchema, {})
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

    const result = await userServiceRemoveKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        keyId: "key-1",
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

  test("exposes the generated request and response descriptors and command", () => {
    expect(RemoveKeyRequestSchema.typeName).toBe("zitadel.user.v2.RemoveKeyRequest")
    expect(RemoveKeyResponseSchema.typeName).toBe("zitadel.user.v2.RemoveKeyResponse")
    expect(UserService.methods.find(({ localName }) => localName === "removeKey")?.name).toBe("RemoveKey")
    expect(usersRemoveKeyCommand).toBeDefined()
  })
})

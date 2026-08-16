import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  RemoveSecretRequestSchema,
  RemoveSecretResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { userRemoveSecretRequestParse } from "../src/v2/userRemoveSecretRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceRemoveSecret } from "../src/v2/userServiceRemoveSecret.js"

describe("UserService.RemoveSecret", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userRemoveSecretRequestParse({
      json: JSON.stringify({ userId: "user-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(RemoveSecretResponseSchema, {})

    const jsonResult = messageSerialize(RemoveSecretResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(RemoveSecretResponseSchema, response, "yaml")
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

    const result = await userServiceRemoveSecret({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceRemoveSecret",
      errorMessage: "request failed",
    })
  })

  test("returns the typed remove secret response from the Connect client", async () => {
    const response = create(RemoveSecretResponseSchema, {})
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

    const result = await userServiceRemoveSecret({
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
    expect(result.data).toBe(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(RemoveSecretRequestSchema.typeName).toBe("zitadel.user.v2.RemoveSecretRequest")
    expect(RemoveSecretResponseSchema.typeName).toBe("zitadel.user.v2.RemoveSecretResponse")
    expect(UserService.methods.find(({ localName }) => localName === "removeSecret")?.name).toBe("RemoveSecret")
  })
})

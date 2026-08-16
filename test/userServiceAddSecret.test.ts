import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { AddSecretRequestSchema, AddSecretResponseSchema } from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { userAddSecretRequestParse } from "../src/v2/userAddSecretRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceAddSecret } from "../src/v2/userServiceAddSecret.js"

describe("UserService.AddSecret", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userAddSecretRequestParse({
      json: JSON.stringify({ userId: "user-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(AddSecretResponseSchema, {
      clientSecret: "secret-1",
    })

    const jsonResult = messageSerialize(AddSecretResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ clientSecret: "secret-1" })

    const yamlResult = messageSerialize(AddSecretResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlResult.data).toContain("clientSecret: secret-1")
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

    const result = await userServiceAddSecret({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceAddSecret",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(AddSecretResponseSchema, {
      clientSecret: "secret-1",
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

    const result = await userServiceAddSecret({
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

    expect(result.data.clientSecret).toBe("secret-1")
  })

  test("exposes the generated request and response descriptors", () => {
    expect(AddSecretRequestSchema.typeName).toBe("zitadel.user.v2.AddSecretRequest")
    expect(AddSecretResponseSchema.typeName).toBe("zitadel.user.v2.AddSecretResponse")
    expect(UserService.methods.find(({ localName }) => localName === "addSecret")?.name).toBe("AddSecret")
  })
})

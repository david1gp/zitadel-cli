import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  DeleteUserMetadataRequestSchema,
  DeleteUserMetadataResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { userDeleteUserMetadataRequestParse } from "../src/v2/userDeleteUserMetadataRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceDeleteUserMetadata } from "../src/v2/userServiceDeleteUserMetadata.js"

describe("UserService.DeleteUserMetadata", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userDeleteUserMetadataRequestParse({
      json: JSON.stringify({ userId: "user-1", keys: ["key-a", "key-b"] }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.keys).toEqual(["key-a", "key-b"])
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(DeleteUserMetadataResponseSchema, {})

    const jsonResult = messageSerialize(DeleteUserMetadataResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(DeleteUserMetadataResponseSchema, response, "yaml")
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

    const result = await userServiceDeleteUserMetadata({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { keys: ["key-a"], userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceDeleteUserMetadata",
      errorMessage: "request failed",
    })
  })

  test("returns the typed delete metadata response from the Connect client", async () => {
    const response = create(DeleteUserMetadataResponseSchema, {})
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

    const result = await userServiceDeleteUserMetadata({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { keys: ["key-a", "key-b"], userId: "user-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toBe(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(DeleteUserMetadataRequestSchema.typeName).toBe("zitadel.user.v2.DeleteUserMetadataRequest")
    expect(DeleteUserMetadataResponseSchema.typeName).toBe("zitadel.user.v2.DeleteUserMetadataResponse")
    expect(UserService.methods.find(({ localName }) => localName === "deleteUserMetadata")?.name).toBe(
      "DeleteUserMetadata",
    )
  })
})

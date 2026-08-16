import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { usersAddKeyCommand } from "../src/cli/usersAddKeyCommand.js"
import { AddKeyRequestSchema, AddKeyResponseSchema } from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userAddKeyRequestParse } from "../src/v2/userAddKeyRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceAddKey } from "../src/v2/userServiceAddKey.js"

describe("UserService.AddKey", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await userAddKeyRequestParse({
      json: JSON.stringify({
        expirationDate: "2030-01-01T00:00:00Z",
        publicKey: "AQI=",
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.publicKey).toEqual(new Uint8Array([1, 2]))
    expect(result.data.expirationDate?.seconds).toBe(1893456000n)
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(AddKeyResponseSchema, {
      creationDate: { nanos: 0, seconds: 1893456000n },
      keyContent: new Uint8Array([1, 2, 3]),
      keyId: "key-1",
    })

    const jsonResult = messageSerialize(AddKeyResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      creationDate: "2030-01-01T00:00:00Z",
      keyContent: "AQID",
      keyId: "key-1",
    })

    const yamlResult = messageSerialize(AddKeyResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      creationDate: "2030-01-01T00:00:00Z",
      keyContent: "AQID",
      keyId: "key-1",
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

    const result = await userServiceAddKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { publicKey: new Uint8Array([1]), userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceAddKey",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(AddKeyResponseSchema, { keyId: "key-1" })
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

    const result = await userServiceAddKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { publicKey: new Uint8Array([1]), userId: "user-1" },
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

  test("builds the CLI command", () => {
    expect(usersAddKeyCommand).toBeDefined()
  })

  test("exposes the generated request and response descriptors", () => {
    expect(AddKeyRequestSchema.typeName).toBe("zitadel.user.v2.AddKeyRequest")
    expect(AddKeyResponseSchema.typeName).toBe("zitadel.user.v2.AddKeyResponse")
    expect(UserService.methods.find(({ localName }) => localName === "addKey")?.name).toBe("AddKey")
  })
})

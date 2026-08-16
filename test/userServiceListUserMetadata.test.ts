import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ListUserMetadataRequestSchema,
  ListUserMetadataResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userListUserMetadataRequestParse } from "../src/v2/userListUserMetadataRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceListUserMetadata } from "../src/v2/userServiceListUserMetadata.js"

describe("UserService.ListUserMetadata", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await userListUserMetadataRequestParse({
      json: JSON.stringify({
        filters: [{ keyFilter: { key: "role", method: "TEXT_FILTER_METHOD_EQUALS" } }],
        pagination: { asc: true, limit: 25, offset: "2" },
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.pagination?.asc).toBe(true)
    expect(result.data.pagination?.limit).toBe(25)
    expect(result.data.pagination?.offset).toBe(2n)
    expect(result.data.filters?.[0]?.filter?.case).toBe("keyFilter")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListUserMetadataResponseSchema, {
      metadata: [{ key: "role", value: new Uint8Array([118, 97, 108, 117, 101]) }],
    })

    const jsonResult = messageSerialize(ListUserMetadataResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      metadata: [{ key: "role", value: "dmFsdWU=" }],
    })

    const yamlResult = messageSerialize(ListUserMetadataResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      metadata: [{ key: "role", value: "dmFsdWU=" }],
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

    const result = await userServiceListUserMetadata({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceListUserMetadata",
      errorMessage: "request failed",
    })
  })

  test("returns the typed metadata response from the Connect client", async () => {
    const response = create(ListUserMetadataResponseSchema, {
      metadata: [{ key: "role", value: new Uint8Array([118, 97, 108, 117, 101]) }],
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

    const result = await userServiceListUserMetadata({
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
    expect(result.data.metadata[0]?.key).toBe("role")
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
    expect(ListUserMetadataRequestSchema.typeName).toBe("zitadel.user.v2.ListUserMetadataRequest")
    expect(ListUserMetadataResponseSchema.typeName).toBe("zitadel.user.v2.ListUserMetadataResponse")
    expect(UserService.methods.find(({ localName }) => localName === "listUserMetadata")?.name).toBe("ListUserMetadata")
  })
})

import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { ListKeysRequestSchema, ListKeysResponseSchema } from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userListKeysRequestParse } from "../src/v2/userListKeysRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceListKeys } from "../src/v2/userServiceListKeys.js"

describe("UserService.ListKeys", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await userListKeysRequestParse({
      json: JSON.stringify({
        filters: [
          {
            userIdFilter: {
              id: "user-1",
            },
          },
        ],
        pagination: {
          asc: true,
          limit: 25,
          offset: "2",
        },
        sortingColumn: "KEY_FIELD_NAME_ID",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.pagination?.asc).toBe(true)
    expect(result.data.pagination?.limit).toBe(25)
    expect(result.data.pagination?.offset).toBe(2n)
    expect(result.data.sortingColumn).toBe(2)

    const filter = result.data.filters?.[0]
    expect(filter?.filter?.case).toBe("userIdFilter")
    if (filter?.filter === undefined || filter.filter.case !== "userIdFilter") {
      return
    }
    expect(filter.filter.value.id).toBe("user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListKeysResponseSchema, {
      result: [
        {
          id: "key-1",
          organizationId: "organization-1",
          userId: "user-1",
        },
      ],
    })

    const jsonResult = messageSerialize(ListKeysResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      result: [
        {
          id: "key-1",
          organizationId: "organization-1",
          userId: "user-1",
        },
      ],
    })

    const yamlResult = messageSerialize(ListKeysResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      result: [
        {
          id: "key-1",
          organizationId: "organization-1",
          userId: "user-1",
        },
      ],
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

    const result = await userServiceListKeys({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceListKeys",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListKeysResponseSchema, {
      result: [{ id: "key-1", userId: "user-1" }],
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

    const result = await userServiceListKeys({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { sortingColumn: 2 },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.result[0]?.id).toBe("key-1")
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
    expect(ListKeysRequestSchema.typeName).toBe("zitadel.user.v2.ListKeysRequest")
    expect(ListKeysResponseSchema.typeName).toBe("zitadel.user.v2.ListKeysResponse")
    expect(UserService.methods.find(({ localName }) => localName === "listKeys")?.name).toBe("ListKeys")
  })
})

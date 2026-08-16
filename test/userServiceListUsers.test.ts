import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { ListUsersRequestSchema, ListUsersResponseSchema } from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userListUsersRequestParse } from "../src/v2/userListUsersRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceListUsers } from "../src/v2/userServiceListUsers.js"

describe("UserService.ListUsers", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await userListUsersRequestParse({
      json: JSON.stringify({
        query: { asc: true, limit: 25, offset: "2" },
        queries: [
          {
            userNameQuery: {
              method: "TEXT_QUERY_METHOD_EQUALS",
              userName: "example",
            },
          },
        ],
        sortingColumn: "USER_FIELD_NAME_USER_NAME",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.query?.asc).toBe(true)
    expect(result.data.query?.limit).toBe(25)
    expect(result.data.query?.offset).toBe(2n)
    expect(result.data.sortingColumn).toBe(1)
    expect(result.data.queries?.[0]?.query?.case).toBe("userNameQuery")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListUsersResponseSchema, {
      result: [{ userId: "user-1", username: "example" }],
    })

    const jsonResult = messageSerialize(ListUsersResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      result: [{ userId: "user-1", username: "example" }],
    })

    const yamlResult = messageSerialize(ListUsersResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      result: [{ userId: "user-1", username: "example" }],
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

    const result = await userServiceListUsers({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceListUsers",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListUsersResponseSchema, {
      result: [{ userId: "user-1", username: "example" }],
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

    const result = await userServiceListUsers({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { sortingColumn: 1 },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.result[0]?.userId).toBe("user-1")
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
    expect(ListUsersRequestSchema.typeName).toBe("zitadel.user.v2.ListUsersRequest")
    expect(ListUsersResponseSchema.typeName).toBe("zitadel.user.v2.ListUsersResponse")
    expect(UserService.methods.find(({ localName }) => localName === "listUsers")?.name).toBe("ListUsers")
  })
})

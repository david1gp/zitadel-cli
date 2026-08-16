import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ListPersonalAccessTokensRequestSchema,
  ListPersonalAccessTokensResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userListPersonalAccessTokensRequestParse } from "../src/v2/userListPersonalAccessTokensRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceListPersonalAccessTokens } from "../src/v2/userServiceListPersonalAccessTokens.js"

describe("UserService.ListPersonalAccessTokens", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userListPersonalAccessTokensRequestParse({
      json: JSON.stringify({
        filters: [{ userIdFilter: { id: "user-1" } }],
        sortingColumn: "PERSONAL_ACCESS_TOKEN_FIELD_NAME_ID",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    const filter = result.data.filters?.[0]
    expect(filter?.filter?.case).toBe("userIdFilter")
    if (filter?.filter?.case !== "userIdFilter") {
      return
    }
    expect(filter.filter.value.id).toBe("user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListPersonalAccessTokensResponseSchema, {
      result: [
        {
          id: "token-1",
          organizationId: "organization-1",
          userId: "user-1",
        },
      ],
    })

    const jsonResult = messageSerialize(ListPersonalAccessTokensResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      result: [{ id: "token-1", organizationId: "organization-1", userId: "user-1" }],
    })

    const yamlResult = messageSerialize(ListPersonalAccessTokensResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      result: [{ id: "token-1", organizationId: "organization-1", userId: "user-1" }],
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

    const result = await userServiceListPersonalAccessTokens({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceListPersonalAccessTokens",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListPersonalAccessTokensResponseSchema, {
      result: [{ id: "token-1", organizationId: "organization-1", userId: "user-1" }],
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

    const result = await userServiceListPersonalAccessTokens({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.result[0]?.id).toBe("token-1")
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
    expect(ListPersonalAccessTokensRequestSchema.typeName).toBe("zitadel.user.v2.ListPersonalAccessTokensRequest")
    expect(ListPersonalAccessTokensResponseSchema.typeName).toBe("zitadel.user.v2.ListPersonalAccessTokensResponse")
    expect(UserService.methods.find(({ localName }) => localName === "listPersonalAccessTokens")?.name).toBe(
      "ListPersonalAccessTokens",
    )
  })
})

import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { usersRemovePersonalAccessTokenCommand } from "../src/cli/usersRemovePersonalAccessTokenCommand.js"
import {
  RemovePersonalAccessTokenRequestSchema,
  RemovePersonalAccessTokenResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userRemovePersonalAccessTokenRequestParse } from "../src/v2/userRemovePersonalAccessTokenRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceRemovePersonalAccessToken } from "../src/v2/userServiceRemovePersonalAccessToken.js"

describe("UserService.RemovePersonalAccessToken", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userRemovePersonalAccessTokenRequestParse({
      json: JSON.stringify({
        tokenId: "token-1",
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.tokenId).toBe("token-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(RemovePersonalAccessTokenResponseSchema, {
      deletionDate: {
        nanos: 0,
        seconds: 1704067200n,
      },
    })

    const jsonResult = messageSerialize(RemovePersonalAccessTokenResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ deletionDate: "2024-01-01T00:00:00Z" })

    const yamlResult = messageSerialize(RemovePersonalAccessTokenResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ deletionDate: "2024-01-01T00:00:00Z" })
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

    const result = await userServiceRemovePersonalAccessToken({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { tokenId: "token-1", userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceRemovePersonalAccessToken",
      errorMessage: "request failed",
    })
  })

  test("returns the typed generated response from the Connect client", async () => {
    const response = create(RemovePersonalAccessTokenResponseSchema, {
      deletionDate: {
        nanos: 0,
        seconds: 1704067200n,
      },
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

    const result = await userServiceRemovePersonalAccessToken({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { tokenId: "token-1", userId: "user-1" },
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
    expect(usersRemovePersonalAccessTokenCommand).toBeDefined()
  })

  test("exposes the generated request and response descriptors", () => {
    expect(RemovePersonalAccessTokenRequestSchema.typeName).toBe("zitadel.user.v2.RemovePersonalAccessTokenRequest")
    expect(RemovePersonalAccessTokenResponseSchema.typeName).toBe("zitadel.user.v2.RemovePersonalAccessTokenResponse")
    expect(UserService.methods.find(({ localName }) => localName === "removePersonalAccessToken")?.name).toBe(
      "RemovePersonalAccessToken",
    )
  })
})

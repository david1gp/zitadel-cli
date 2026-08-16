import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  AddPersonalAccessTokenRequestSchema,
  AddPersonalAccessTokenResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userAddPersonalAccessTokenRequestParse } from "../src/v2/userAddPersonalAccessTokenRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceAddPersonalAccessToken } from "../src/v2/userServiceAddPersonalAccessToken.js"

describe("UserService.AddPersonalAccessToken", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userAddPersonalAccessTokenRequestParse({
      json: JSON.stringify({
        expirationDate: "2030-01-01T00:00:00Z",
        userId: "machine-user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("machine-user-1")
    expect(result.data.expirationDate?.seconds).toBe(1893456000n)
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(AddPersonalAccessTokenResponseSchema, {
      creationDate: { nanos: 0, seconds: 1893456000n },
      token: "personal-access-token",
      tokenId: "token-1",
    })

    const jsonResult = messageSerialize(AddPersonalAccessTokenResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      creationDate: "2030-01-01T00:00:00Z",
      token: "personal-access-token",
      tokenId: "token-1",
    })

    const yamlResult = messageSerialize(AddPersonalAccessTokenResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      creationDate: "2030-01-01T00:00:00Z",
      token: "personal-access-token",
      tokenId: "token-1",
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

    const result = await userServiceAddPersonalAccessToken({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        userId: "machine-user-1",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceAddPersonalAccessToken",
      errorMessage: "request failed",
    })
  })

  test("returns the typed personal access token response from the Connect client", async () => {
    const response = create(AddPersonalAccessTokenResponseSchema, {
      token: "personal-access-token",
      tokenId: "token-1",
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

    const result = await userServiceAddPersonalAccessToken({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        userId: "machine-user-1",
      },
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

  test("exposes the generated request and response descriptors", () => {
    expect(AddPersonalAccessTokenRequestSchema.typeName).toBe("zitadel.user.v2.AddPersonalAccessTokenRequest")
    expect(AddPersonalAccessTokenResponseSchema.typeName).toBe("zitadel.user.v2.AddPersonalAccessTokenResponse")
    expect(UserService.methods.find(({ localName }) => localName === "addPersonalAccessToken")?.name).toBe(
      "AddPersonalAccessToken",
    )
  })
})

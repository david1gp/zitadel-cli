import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ListAuthenticationMethodTypesRequestSchema,
  ListAuthenticationMethodTypesResponseSchema,
  AuthenticationMethodType,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userListAuthenticationMethodTypesRequestParse } from "../src/v2/userListAuthenticationMethodTypesRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceListAuthenticationMethodTypes } from "../src/v2/userServiceListAuthenticationMethodTypes.js"

describe("UserService.ListAuthenticationMethodTypes", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userListAuthenticationMethodTypesRequestParse({
      json: JSON.stringify({
        domainQuery: { domain: "example.com", includeWithoutDomain: true },
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.domainQuery?.domain).toBe("example.com")
    expect(result.data.domainQuery?.includeWithoutDomain).toBe(true)
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListAuthenticationMethodTypesResponseSchema, {
      authMethodTypes: [AuthenticationMethodType.PASSWORD, AuthenticationMethodType.PASSKEY],
    })

    const jsonResult = messageSerialize(ListAuthenticationMethodTypesResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      authMethodTypes: ["AUTHENTICATION_METHOD_TYPE_PASSWORD", "AUTHENTICATION_METHOD_TYPE_PASSKEY"],
    })

    const yamlResult = messageSerialize(ListAuthenticationMethodTypesResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      authMethodTypes: ["AUTHENTICATION_METHOD_TYPE_PASSWORD", "AUTHENTICATION_METHOD_TYPE_PASSKEY"],
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

    const result = await userServiceListAuthenticationMethodTypes({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceListAuthenticationMethodTypes",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListAuthenticationMethodTypesResponseSchema, {
      authMethodTypes: [AuthenticationMethodType.PASSWORD],
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

    const result = await userServiceListAuthenticationMethodTypes({
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
    expect(result.data.authMethodTypes[0]).toBe(AuthenticationMethodType.PASSWORD)
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
    expect(ListAuthenticationMethodTypesRequestSchema.typeName).toBe(
      "zitadel.user.v2.ListAuthenticationMethodTypesRequest",
    )
    expect(ListAuthenticationMethodTypesResponseSchema.typeName).toBe(
      "zitadel.user.v2.ListAuthenticationMethodTypesResponse",
    )
    expect(UserService.methods.find(({ localName }) => localName === "listAuthenticationMethodTypes")?.name).toBe(
      "ListAuthenticationMethodTypes",
    )
  })
})

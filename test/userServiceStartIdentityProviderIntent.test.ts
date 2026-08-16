import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  StartIdentityProviderIntentRequestSchema,
  StartIdentityProviderIntentResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceStartIdentityProviderIntent } from "../src/v2/userServiceStartIdentityProviderIntent.js"
import { userStartIdentityProviderIntentRequestParse } from "../src/v2/userStartIdentityProviderIntentRequestParse.js"

describe("UserService.StartIdentityProviderIntent", () => {
  test("parses the generated protobuf JSON request with redirect URLs", async () => {
    const result = await userStartIdentityProviderIntentRequestParse({
      json: JSON.stringify({
        idpId: "idp-1",
        urls: {
          failureUrl: "https://example.test/failure",
          loginHint: "user@example.test",
          successUrl: "https://example.test/success",
        },
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.idpId).toBe("idp-1")
    const content = result.data.content
    expect(content?.case).toBe("urls")
    if (content?.case !== "urls" || content.value === undefined) {
      return
    }
    const urls = content.value as { failureUrl: string; loginHint: string; successUrl: string }
    expect(urls.successUrl).toBe("https://example.test/success")
    expect(urls.failureUrl).toBe("https://example.test/failure")
    expect(urls.loginHint).toBe("user@example.test")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(StartIdentityProviderIntentResponseSchema, {
      details: { resourceOwner: "organization-1", sequence: 1n },
      nextStep: { case: "authUrl", value: "https://idp.example.test/auth" },
    })

    const jsonResult = messageSerialize(StartIdentityProviderIntentResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      details: {
        resourceOwner: "organization-1",
        sequence: "1",
      },
      authUrl: "https://idp.example.test/auth",
    })

    const yamlResult = messageSerialize(StartIdentityProviderIntentResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      details: {
        resourceOwner: "organization-1",
        sequence: "1",
      },
      authUrl: "https://idp.example.test/auth",
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

    const result = await userServiceStartIdentityProviderIntent({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { idpId: "idp-1", content: { case: "ldap", value: { password: "secret", username: "user" } } },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceStartIdentityProviderIntent",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(StartIdentityProviderIntentResponseSchema, {
      nextStep: { case: "idpIntent", value: { idpIntentId: "intent-1", idpIntentToken: "token-1" } },
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

    const result = await userServiceStartIdentityProviderIntent({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        content: {
          case: "urls",
          value: { failureUrl: "https://example.test/failure", successUrl: "https://example.test/success" },
        },
        idpId: "idp-1",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toBe(response)
    expect(result.data.nextStep.case).toBe("idpIntent")
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
    expect(StartIdentityProviderIntentRequestSchema.typeName).toBe("zitadel.user.v2.StartIdentityProviderIntentRequest")
    expect(StartIdentityProviderIntentResponseSchema.typeName).toBe(
      "zitadel.user.v2.StartIdentityProviderIntentResponse",
    )
    expect(UserService.methods.find(({ localName }) => localName === "startIdentityProviderIntent")?.name).toBe(
      "StartIdentityProviderIntent",
    )
  })
})

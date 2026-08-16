import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  RetrieveIdentityProviderIntentRequestSchema,
  RetrieveIdentityProviderIntentResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userRetrieveIdentityProviderIntentRequestParse } from "../src/v2/userRetrieveIdentityProviderIntentRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceRetrieveIdentityProviderIntent } from "../src/v2/userServiceRetrieveIdentityProviderIntent.js"

describe("UserService.RetrieveIdentityProviderIntent", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userRetrieveIdentityProviderIntentRequestParse({
      json: JSON.stringify({ idpIntentId: "intent-1", idpIntentToken: "token-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.idpIntentId).toBe("intent-1")
    expect(result.data.idpIntentToken).toBe("token-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(RetrieveIdentityProviderIntentResponseSchema, {
      userId: "user-1",
    })

    const jsonResult = messageSerialize(RetrieveIdentityProviderIntentResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ userId: "user-1" })

    const yamlResult = messageSerialize(RetrieveIdentityProviderIntentResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ userId: "user-1" })
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

    const result = await userServiceRetrieveIdentityProviderIntent({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { idpIntentId: "intent-1", idpIntentToken: "token-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceRetrieveIdentityProviderIntent",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(RetrieveIdentityProviderIntentResponseSchema, {
      userId: "user-1",
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

    const result = await userServiceRetrieveIdentityProviderIntent({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { idpIntentId: "intent-1", idpIntentToken: "token-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.userId).toBe("user-1")
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
    expect(RetrieveIdentityProviderIntentRequestSchema.typeName).toBe(
      "zitadel.user.v2.RetrieveIdentityProviderIntentRequest",
    )
    expect(RetrieveIdentityProviderIntentResponseSchema.typeName).toBe(
      "zitadel.user.v2.RetrieveIdentityProviderIntentResponse",
    )
    expect(UserService.methods.find(({ localName }) => localName === "retrieveIdentityProviderIntent")?.name).toBe(
      "RetrieveIdentityProviderIntent",
    )
  })
})

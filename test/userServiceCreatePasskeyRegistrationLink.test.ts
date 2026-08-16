import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  CreatePasskeyRegistrationLinkRequestSchema,
  CreatePasskeyRegistrationLinkResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userCreatePasskeyRegistrationLinkRequestParse } from "../src/v2/userCreatePasskeyRegistrationLinkRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceCreatePasskeyRegistrationLink } from "../src/v2/userServiceCreatePasskeyRegistrationLink.js"

describe("UserService.CreatePasskeyRegistrationLink", () => {
  test("parses the generated protobuf JSON request with a return code medium", async () => {
    const result = await userCreatePasskeyRegistrationLinkRequestParse({
      json: JSON.stringify({
        userId: "user-1",
        returnCode: {},
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.medium?.case).toBe("returnCode")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(CreatePasskeyRegistrationLinkResponseSchema, {
      code: { code: "registration-code", id: "code-1" },
    })

    const jsonResult = messageSerialize(CreatePasskeyRegistrationLinkResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      code: { code: "registration-code", id: "code-1" },
    })

    const yamlResult = messageSerialize(CreatePasskeyRegistrationLinkResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      code: { code: "registration-code", id: "code-1" },
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

    const result = await userServiceCreatePasskeyRegistrationLink({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceCreatePasskeyRegistrationLink",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(CreatePasskeyRegistrationLinkResponseSchema, {
      code: { code: "registration-code", id: "code-1" },
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

    const result = await userServiceCreatePasskeyRegistrationLink({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        userId: "user-1",
        medium: { case: "returnCode", value: {} },
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.code?.id).toBe("code-1")
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
    expect(CreatePasskeyRegistrationLinkRequestSchema.typeName).toBe(
      "zitadel.user.v2.CreatePasskeyRegistrationLinkRequest",
    )
    expect(CreatePasskeyRegistrationLinkResponseSchema.typeName).toBe(
      "zitadel.user.v2.CreatePasskeyRegistrationLinkResponse",
    )
    expect(UserService.methods.find(({ localName }) => localName === "createPasskeyRegistrationLink")?.name).toBe(
      "CreatePasskeyRegistrationLink",
    )
  })
})

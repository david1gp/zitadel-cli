import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { DetailsSchema } from "../src/generated/zitadel/object/v2/object_pb.js"
import {
  VerifyEmailRequestSchema,
  VerifyEmailResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userVerifyEmailRequestParse } from "../src/v2/userVerifyEmailRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceVerifyEmail } from "../src/v2/userServiceVerifyEmail.js"

describe("UserService.VerifyEmail", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userVerifyEmailRequestParse({
      json: JSON.stringify({
        userId: "user-1",
        verificationCode: "verification-code",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.verificationCode).toBe("verification-code")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(VerifyEmailResponseSchema, {
      details: create(DetailsSchema, {
        resourceOwner: "org-1",
        sequence: 7n,
      }),
    })

    const jsonResult = messageSerialize(VerifyEmailResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      details: { resourceOwner: "org-1", sequence: "7" },
    })

    const yamlResult = messageSerialize(VerifyEmailResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      details: { resourceOwner: "org-1", sequence: "7" },
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

    const result = await userServiceVerifyEmail({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        userId: "user-1",
        verificationCode: "verification-code",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceVerifyEmail",
      errorMessage: "request failed",
    })
  })

  test("returns the typed verification response from the Connect client", async () => {
    const response = create(VerifyEmailResponseSchema, {
      details: create(DetailsSchema, {
        resourceOwner: "org-1",
        sequence: 7n,
      }),
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

    const result = await userServiceVerifyEmail({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        userId: "user-1",
        verificationCode: "verification-code",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.details?.resourceOwner).toBe("org-1")
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
    expect(VerifyEmailRequestSchema.typeName).toBe("zitadel.user.v2.VerifyEmailRequest")
    expect(VerifyEmailResponseSchema.typeName).toBe("zitadel.user.v2.VerifyEmailResponse")
    expect(UserService.methods.find(({ localName }) => localName === "verifyEmail")?.name).toBe("VerifyEmail")
  })
})

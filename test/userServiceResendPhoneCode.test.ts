import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { usersResendPhoneCodeCommand } from "../src/cli/usersResendPhoneCodeCommand.js"
import {
  ResendPhoneCodeRequestSchema,
  ResendPhoneCodeResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userResendPhoneCodeRequestParse } from "../src/v2/userResendPhoneCodeRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceResendPhoneCode } from "../src/v2/userServiceResendPhoneCode.js"

describe("UserService.ResendPhoneCode", () => {
  test("parses the generated protobuf JSON request and oneof", async () => {
    const result = await userResendPhoneCodeRequestParse({
      json: JSON.stringify({
        returnCode: {},
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.verification?.case).toBe("returnCode")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ResendPhoneCodeResponseSchema, {
      verificationCode: "123456",
    })

    const jsonResult = messageSerialize(ResendPhoneCodeResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ verificationCode: "123456" })

    const yamlResult = messageSerialize(ResendPhoneCodeResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ verificationCode: "123456" })
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

    const result = await userServiceResendPhoneCode({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceResendPhoneCode",
      errorMessage: "request failed",
    })
  })

  test("returns the typed resend response from the Connect client", async () => {
    const response = create(ResendPhoneCodeResponseSchema, {
      verificationCode: "123456",
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

    const result = await userServiceResendPhoneCode({
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
    expect(result.data.verificationCode).toBe("123456")
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
    expect(usersResendPhoneCodeCommand).toBeDefined()
  })

  test("exposes the generated request and response descriptors", () => {
    expect(ResendPhoneCodeRequestSchema.typeName).toBe("zitadel.user.v2.ResendPhoneCodeRequest")
    expect(ResendPhoneCodeResponseSchema.typeName).toBe("zitadel.user.v2.ResendPhoneCodeResponse")
    expect(UserService.methods.find(({ localName }) => localName === "resendPhoneCode")?.name).toBe("ResendPhoneCode")
  })
})

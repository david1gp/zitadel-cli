import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import {
  SendEmailCodeRequestSchema,
  SendEmailCodeResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { userSendEmailCodeRequestParse } from "../src/v2/userSendEmailCodeRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceSendEmailCode } from "../src/v2/userServiceSendEmailCode.js"

describe("UserService.SendEmailCode", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userSendEmailCodeRequestParse({
      json: JSON.stringify({
        userId: "user-1",
        sendCode: {
          urlTemplate: "https://example.test/verify?user={{.UserID}}&code={{.Code}}",
        },
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    const verification = result.data.verification
    expect(verification?.case).toBe("sendCode")
    if (verification?.case !== "sendCode" || verification.value === undefined) {
      return
    }
    expect(verification.value.urlTemplate).toBe("https://example.test/verify?user={{.UserID}}&code={{.Code}}")
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

    const result = await userServiceSendEmailCode({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceSendEmailCode",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(SendEmailCodeResponseSchema, {
      verificationCode: "verification-code",
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

    const result = await userServiceSendEmailCode({
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
    expect(result.data.verificationCode).toBe("verification-code")
  })

  test("exposes the generated request and response descriptors", () => {
    expect(SendEmailCodeRequestSchema.typeName).toBe("zitadel.user.v2.SendEmailCodeRequest")
    expect(SendEmailCodeResponseSchema.typeName).toBe("zitadel.user.v2.SendEmailCodeResponse")
    expect(UserService.methods.find(({ localName }) => localName === "sendEmailCode")?.name).toBe("SendEmailCode")
  })
})

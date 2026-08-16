import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ResendEmailCodeRequestSchema,
  ResendEmailCodeResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { userResendEmailCodeRequestParse } from "../src/v2/userResendEmailCodeRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceResendEmailCode } from "../src/v2/userServiceResendEmailCode.js"

describe("UserService.ResendEmailCode", () => {
  test("parses the generated protobuf JSON request and both verification modes", async () => {
    const sendResult = await userResendEmailCodeRequestParse({
      json: JSON.stringify({
        userId: "user-1",
        sendCode: {
          urlTemplate: "https://example.test/verify?user={{.UserID}}&code={{.Code}}",
        },
      }),
    })

    expect(sendResult.success).toBe(true)
    if (!sendResult.success) {
      return
    }

    expect(sendResult.data.userId).toBe("user-1")
    expect(sendResult.data.verification?.case).toBe("sendCode")
    if (sendResult.data.verification?.case !== "sendCode") {
      return
    }
    expect(sendResult.data.verification.value).toMatchObject({
      urlTemplate: "https://example.test/verify?user={{.UserID}}&code={{.Code}}",
    })

    const returnResult = await userResendEmailCodeRequestParse({
      json: JSON.stringify({
        userId: "user-1",
        returnCode: {},
      }),
    })

    expect(returnResult.success).toBe(true)
    if (!returnResult.success) {
      return
    }
    expect(returnResult.data.verification?.case).toBe("returnCode")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ResendEmailCodeResponseSchema, {
      verificationCode: "123456",
    })

    const jsonResult = messageSerialize(ResendEmailCodeResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ verificationCode: "123456" })

    const yamlResult = messageSerialize(ResendEmailCodeResponseSchema, response, "yaml")
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

    const result = await userServiceResendEmailCode({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceResendEmailCode",
      errorMessage: "request failed",
    })
  })

  test("returns the typed generated response from the Connect client", async () => {
    const response = create(ResendEmailCodeResponseSchema, {
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

    const result = await userServiceResendEmailCode({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        userId: "user-1",
        verification: { case: "returnCode", value: {} },
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.verificationCode).toBe("123456")
  })

  test("exposes the generated request and response descriptors", () => {
    expect(ResendEmailCodeRequestSchema.typeName).toBe("zitadel.user.v2.ResendEmailCodeRequest")
    expect(ResendEmailCodeResponseSchema.typeName).toBe("zitadel.user.v2.ResendEmailCodeResponse")
    expect(UserService.methods.find(({ localName }) => localName === "resendEmailCode")?.name).toBe("ResendEmailCode")
  })
})

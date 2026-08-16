import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { RemoveTOTPRequestSchema, RemoveTOTPResponseSchema } from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { userRemoveTOTPRequestParse } from "../src/v2/userRemoveTOTPRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceRemoveTOTP } from "../src/v2/userServiceRemoveTOTP.js"

describe("UserService.RemoveTOTP", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userRemoveTOTPRequestParse({
      json: JSON.stringify({ userId: "user-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(RemoveTOTPResponseSchema, {})

    const jsonResult = messageSerialize(RemoveTOTPResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(RemoveTOTPResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({})
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

    const result = await userServiceRemoveTOTP({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceRemoveTOTP",
      errorMessage: "request failed",
    })
  })

  test("returns the typed remove TOTP response from the Connect client", async () => {
    const response = create(RemoveTOTPResponseSchema, {})
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

    const result = await userServiceRemoveTOTP({
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
    expect(result.data).toBe(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(RemoveTOTPRequestSchema.typeName).toBe("zitadel.user.v2.RemoveTOTPRequest")
    expect(RemoveTOTPResponseSchema.typeName).toBe("zitadel.user.v2.RemoveTOTPResponse")
    expect(UserService.methods.find(({ localName }) => localName === "removeTOTP")?.name).toBe("RemoveTOTP")
  })
})

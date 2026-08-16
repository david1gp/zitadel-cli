import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { usersAddOTPSMSCommand } from "../src/cli/usersAddOTPSMSCommand.js"
import { AddOTPSMSRequestSchema, AddOTPSMSResponseSchema } from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userAddOTPSMSRequestParse } from "../src/v2/userAddOTPSMSRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceAddOTPSMS } from "../src/v2/userServiceAddOTPSMS.js"

describe("UserService.AddOTPSMS", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userAddOTPSMSRequestParse({
      json: JSON.stringify({ userId: "user-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(AddOTPSMSResponseSchema, {})

    const jsonResult = messageSerialize(AddOTPSMSResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(AddOTPSMSResponseSchema, response, "yaml")
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

    const result = await userServiceAddOTPSMS({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceAddOTPSMS",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(AddOTPSMSResponseSchema, {})
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

    const result = await userServiceAddOTPSMS({
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

  test("adds the bearer token to Connect requests", async () => {
    const request = { header: new Headers() } as unknown as UnaryRequest
    const next = async (received: UnaryRequest | StreamRequest): Promise<UnaryResponse> => {
      expect(received.header.get("Authorization")).toBe("Bearer bearer-token")
      return {} as UnaryResponse
    }

    await zitadelBearerInterceptorCreate("bearer-token")(next)(request)
  })

  test("builds the CLI command", () => {
    expect(usersAddOTPSMSCommand).toBeDefined()
  })

  test("exposes the generated request and response descriptors", () => {
    expect(AddOTPSMSRequestSchema.typeName).toBe("zitadel.user.v2.AddOTPSMSRequest")
    expect(AddOTPSMSResponseSchema.typeName).toBe("zitadel.user.v2.AddOTPSMSResponse")
    expect(UserService.methods.find(({ localName }) => localName === "addOTPSMS")?.name).toBe("AddOTPSMS")
  })
})

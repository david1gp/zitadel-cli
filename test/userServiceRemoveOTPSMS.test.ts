import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { usersRemoveOTPSMSCommand } from "../src/cli/usersRemoveOTPSMSCommand.js"
import {
  RemoveOTPSMSRequestSchema,
  RemoveOTPSMSResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userRemoveOTPSMSRequestParse } from "../src/v2/userRemoveOTPSMSRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceRemoveOTPSMS } from "../src/v2/userServiceRemoveOTPSMS.js"

describe("UserService.RemoveOTPSMS", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userRemoveOTPSMSRequestParse({
      json: JSON.stringify({ userId: "user-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(RemoveOTPSMSResponseSchema, {})

    const jsonResult = messageSerialize(RemoveOTPSMSResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(RemoveOTPSMSResponseSchema, response, "yaml")
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

    const result = await userServiceRemoveOTPSMS({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceRemoveOTPSMS",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(RemoveOTPSMSResponseSchema, {})
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

    const result = await userServiceRemoveOTPSMS({
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
    expect(usersRemoveOTPSMSCommand).toBeDefined()
  })

  test("exposes the generated request and response descriptors", () => {
    expect(RemoveOTPSMSRequestSchema.typeName).toBe("zitadel.user.v2.RemoveOTPSMSRequest")
    expect(RemoveOTPSMSResponseSchema.typeName).toBe("zitadel.user.v2.RemoveOTPSMSResponse")
    expect(UserService.methods.find(({ localName }) => localName === "removeOTPSMS")?.name).toBe("RemoveOTPSMS")
  })
})

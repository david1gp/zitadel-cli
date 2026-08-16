import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { usersSetPasswordCommand } from "../src/cli/usersSetPasswordCommand.js"
import {
  SetPasswordRequestSchema,
  SetPasswordResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceSetPassword } from "../src/v2/userServiceSetPassword.js"
import { userSetPasswordRequestParse } from "../src/v2/userSetPasswordRequestParse.js"

describe("UserService.SetPassword", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userSetPasswordRequestParse({
      json: JSON.stringify({
        currentPassword: "old-password",
        newPassword: {
          changeRequired: true,
          password: "new-password",
        },
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.newPassword?.password).toBe("new-password")
    expect(result.data.newPassword?.changeRequired).toBe(true)
    expect(result.data.verification).toEqual({ case: "currentPassword", value: "old-password" })
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(SetPasswordResponseSchema, {})

    const jsonResult = messageSerialize(SetPasswordResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(SetPasswordResponseSchema, response, "yaml")
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

    const result = await userServiceSetPassword({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceSetPassword",
      errorMessage: "request failed",
    })
  })

  test("returns the typed set password response from the Connect client", async () => {
    const response = create(SetPasswordResponseSchema, {})
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

    const result = await userServiceSetPassword({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        userId: "user-1",
        verification: {
          case: "currentPassword",
          value: "old-password",
        },
      },
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

  test("exposes the generated request and response descriptors and command", () => {
    expect(SetPasswordRequestSchema.typeName).toBe("zitadel.user.v2.SetPasswordRequest")
    expect(SetPasswordResponseSchema.typeName).toBe("zitadel.user.v2.SetPasswordResponse")
    expect(UserService.methods.find(({ localName }) => localName === "setPassword")?.name).toBe("SetPassword")
    expect(usersSetPasswordCommand).toBeDefined()
  })
})

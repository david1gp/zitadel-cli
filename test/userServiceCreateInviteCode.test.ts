import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { usersCreateInviteCodeCommand } from "../src/cli/usersCreateInviteCodeCommand.js"
import {
  CreateInviteCodeRequestSchema,
  CreateInviteCodeResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userCreateInviteCodeRequestParse } from "../src/v2/userCreateInviteCodeRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceCreateInviteCode } from "../src/v2/userServiceCreateInviteCode.js"

describe("UserService.CreateInviteCode", () => {
  test("parses the generated protobuf JSON request with a return code verification", async () => {
    const result = await userCreateInviteCodeRequestParse({
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
    const response = create(CreateInviteCodeResponseSchema, {
      inviteCode: "invite-code-1",
    })

    const jsonResult = messageSerialize(CreateInviteCodeResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ inviteCode: "invite-code-1" })

    const yamlResult = messageSerialize(CreateInviteCodeResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ inviteCode: "invite-code-1" })
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

    const result = await userServiceCreateInviteCode({
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

    expect(result).toEqual({
      success: false,
      op: "userServiceCreateInviteCode",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(CreateInviteCodeResponseSchema, {
      inviteCode: "invite-code-1",
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

    const result = await userServiceCreateInviteCode({
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
    expect(CreateInviteCodeRequestSchema.typeName).toBe("zitadel.user.v2.CreateInviteCodeRequest")
    expect(CreateInviteCodeResponseSchema.typeName).toBe("zitadel.user.v2.CreateInviteCodeResponse")
    expect(UserService.methods.find(({ localName }) => localName === "createInviteCode")?.name).toBe("CreateInviteCode")
    expect(usersCreateInviteCodeCommand).toBeDefined()
  })
})

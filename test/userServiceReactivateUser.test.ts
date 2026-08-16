import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { usersReactivateCommand } from "../src/cli/usersReactivateCommand.js"
import {
  ReactivateUserRequestSchema,
  ReactivateUserResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { userReactivateUserRequestParse } from "../src/v2/userReactivateUserRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceReactivateUser } from "../src/v2/userServiceReactivateUser.js"

describe("UserService.ReactivateUser", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userReactivateUserRequestParse({
      json: JSON.stringify({ userId: "user-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ReactivateUserResponseSchema)

    const jsonResult = messageSerialize(ReactivateUserResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(ReactivateUserResponseSchema, response, "yaml")
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

    const result = await userServiceReactivateUser({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceReactivateUser",
      errorMessage: "request failed",
    })
  })

  test("returns the typed reactivate response from the Connect client", async () => {
    const response = create(ReactivateUserResponseSchema)
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

    const result = await userServiceReactivateUser({
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

  test("builds the CLI command", () => {
    expect(usersReactivateCommand).toBeDefined()
  })

  test("exposes the generated request and response descriptors", () => {
    expect(ReactivateUserRequestSchema.typeName).toBe("zitadel.user.v2.ReactivateUserRequest")
    expect(ReactivateUserResponseSchema.typeName).toBe("zitadel.user.v2.ReactivateUserResponse")
    expect(UserService.methods.find(({ localName }) => localName === "reactivateUser")?.name).toBe("ReactivateUser")
  })
})

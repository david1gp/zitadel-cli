import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { usersRemoveRecoveryCodesCommand } from "../src/cli/usersRemoveRecoveryCodesCommand.js"
import {
  RemoveRecoveryCodesRequestSchema,
  RemoveRecoveryCodesResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { userRemoveRecoveryCodesRequestParse } from "../src/v2/userRemoveRecoveryCodesRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceRemoveRecoveryCodes } from "../src/v2/userServiceRemoveRecoveryCodes.js"

describe("UserService.RemoveRecoveryCodes", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userRemoveRecoveryCodesRequestParse({
      json: JSON.stringify({ userId: "user-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(RemoveRecoveryCodesResponseSchema, {})

    const jsonResult = messageSerialize(RemoveRecoveryCodesResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(RemoveRecoveryCodesResponseSchema, response, "yaml")
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

    const result = await userServiceRemoveRecoveryCodes({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceRemoveRecoveryCodes",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(RemoveRecoveryCodesResponseSchema, {})
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

    const result = await userServiceRemoveRecoveryCodes({
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
    expect(result.data).toEqual(response)
  })

  test("exposes the generated request and response descriptors and command", () => {
    expect(RemoveRecoveryCodesRequestSchema.typeName).toBe("zitadel.user.v2.RemoveRecoveryCodesRequest")
    expect(RemoveRecoveryCodesResponseSchema.typeName).toBe("zitadel.user.v2.RemoveRecoveryCodesResponse")
    expect(UserService.methods.find(({ localName }) => localName === "removeRecoveryCodes")?.name).toBe(
      "RemoveRecoveryCodes",
    )
    expect(usersRemoveRecoveryCodesCommand).toBeDefined()
  })
})

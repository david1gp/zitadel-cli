import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  GenerateRecoveryCodesRequestSchema,
  GenerateRecoveryCodesResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { UserService } from "../src/v2/userService.js"
import { userGenerateRecoveryCodesRequestParse } from "../src/v2/userGenerateRecoveryCodesRequestParse.js"
import { userServiceGenerateRecoveryCodes } from "../src/v2/userServiceGenerateRecoveryCodes.js"

describe("UserService.GenerateRecoveryCodes", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userGenerateRecoveryCodesRequestParse({
      json: JSON.stringify({
        count: 5,
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.count).toBe(5)
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(GenerateRecoveryCodesResponseSchema, {
      recoveryCodes: ["recovery-code-1", "recovery-code-2"],
    })

    const jsonResult = messageSerialize(GenerateRecoveryCodesResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      recoveryCodes: ["recovery-code-1", "recovery-code-2"],
    })

    const yamlResult = messageSerialize(GenerateRecoveryCodesResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      recoveryCodes: ["recovery-code-1", "recovery-code-2"],
    })
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

    const result = await userServiceGenerateRecoveryCodes({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        count: 5,
        userId: "user-1",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceGenerateRecoveryCodes",
      errorMessage: "request failed",
    })
  })

  test("returns the typed recovery codes response from the Connect client", async () => {
    const response = create(GenerateRecoveryCodesResponseSchema, {
      recoveryCodes: ["recovery-code-1"],
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

    const result = await userServiceGenerateRecoveryCodes({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        count: 1,
        userId: "user-1",
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

  test("exposes the generated request and response descriptors", () => {
    expect(GenerateRecoveryCodesRequestSchema.typeName).toBe("zitadel.user.v2.GenerateRecoveryCodesRequest")
    expect(GenerateRecoveryCodesResponseSchema.typeName).toBe("zitadel.user.v2.GenerateRecoveryCodesResponse")
    expect(UserService.methods.find(({ localName }) => localName === "generateRecoveryCodes")?.name).toBe(
      "GenerateRecoveryCodes",
    )
  })
})

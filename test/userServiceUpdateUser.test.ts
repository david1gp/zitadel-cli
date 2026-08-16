import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { UpdateUserRequestSchema, UpdateUserResponseSchema } from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceUpdateUser } from "../src/v2/userServiceUpdateUser.js"
import { userUpdateUserRequestParse } from "../src/v2/userUpdateUserRequestParse.js"

describe("UserService.UpdateUser", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userUpdateUserRequestParse({
      json: JSON.stringify({
        machine: {
          accessTokenType: "ACCESS_TOKEN_TYPE_JWT",
          description: "Automation user",
          name: "Automation",
        },
        metadata: [{ key: "owner", value: "ZGF2aWQ=" }],
        userId: "user-1",
        username: "automation",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.username).toBe("automation")
    const userType = result.data.userType
    expect(userType?.case).toBe("machine")
    if (userType?.case !== "machine" || !("name" in userType.value)) {
      return
    }
    expect(userType.value.name).toBe("Automation")
    expect(userType.value.accessTokenType).toBe(1)
    expect(result.data.metadata?.[0]?.value).toEqual(new Uint8Array([100, 97, 118, 105, 100]))
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(UpdateUserResponseSchema, {
      changeDate: { nanos: 0, seconds: 1893456000n },
      emailCode: "email-code",
      phoneCode: "phone-code",
    })

    const jsonResult = messageSerialize(UpdateUserResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      changeDate: "2030-01-01T00:00:00Z",
      emailCode: "email-code",
      phoneCode: "phone-code",
    })

    const yamlResult = messageSerialize(UpdateUserResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      changeDate: "2030-01-01T00:00:00Z",
      emailCode: "email-code",
      phoneCode: "phone-code",
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

    const result = await userServiceUpdateUser({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceUpdateUser",
      errorMessage: "request failed",
    })
  })

  test("returns the typed update response from the Connect client", async () => {
    const response = create(UpdateUserResponseSchema, { emailCode: "email-code" })
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

    const result = await userServiceUpdateUser({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        userId: "user-1",
        username: "automation",
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
    expect(UpdateUserRequestSchema.typeName).toBe("zitadel.user.v2.UpdateUserRequest")
    expect(UpdateUserResponseSchema.typeName).toBe("zitadel.user.v2.UpdateUserResponse")
    expect(UserService.methods.find(({ localName }) => localName === "updateUser")?.name).toBe("UpdateUser")
  })
})

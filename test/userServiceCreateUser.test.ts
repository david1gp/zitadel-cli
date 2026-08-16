import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { CreateUserRequestSchema, CreateUserResponseSchema } from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userCreateUserRequestParse } from "../src/v2/userCreateUserRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceCreateUser } from "../src/v2/userServiceCreateUser.js"

describe("UserService.CreateUser", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userCreateUserRequestParse({
      json: JSON.stringify({
        organizationId: "organization-1",
        userId: "user-1",
        username: "automation",
        machine: {
          accessTokenType: "ACCESS_TOKEN_TYPE_JWT",
          name: "Automation",
        },
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.organizationId).toBe("organization-1")
    expect(result.data.userId).toBe("user-1")
    expect(result.data.userType?.case).toBe("machine")
    if (result.data.userType?.case !== "machine") {
      return
    }
    expect(result.data.userType.value.name).toBe("Automation")
    expect(result.data.userType.value.accessTokenType).toBe(1)
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(CreateUserResponseSchema, { id: "user-1" })

    const jsonResult = messageSerialize(CreateUserResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ id: "user-1" })

    const yamlResult = messageSerialize(CreateUserResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ id: "user-1" })
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

    const result = await userServiceCreateUser({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceCreateUser",
      errorMessage: "request failed",
    })
  })

  test("returns the typed create response from the Connect client", async () => {
    const response = create(CreateUserResponseSchema, { id: "user-1" })
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

    const result = await userServiceCreateUser({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        organizationId: "organization-1",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.id).toBe("user-1")
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
    expect(CreateUserRequestSchema.typeName).toBe("zitadel.user.v2.CreateUserRequest")
    expect(CreateUserResponseSchema.typeName).toBe("zitadel.user.v2.CreateUserResponse")
    expect(UserService.methods.find(({ localName }) => localName === "createUser")?.name).toBe("CreateUser")
  })
})

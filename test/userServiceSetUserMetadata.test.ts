import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  SetUserMetadataRequestSchema,
  SetUserMetadataResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceSetUserMetadata } from "../src/v2/userServiceSetUserMetadata.js"
import { userSetUserMetadataRequestParse } from "../src/v2/userSetUserMetadataRequestParse.js"

describe("UserService.SetUserMetadata", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userSetUserMetadataRequestParse({
      json: JSON.stringify({
        metadata: [{ key: "owner", value: "ZGF2aWQ=" }],
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.metadata?.[0]?.key).toBe("owner")
    expect(result.data.metadata?.[0]?.value).toEqual(new Uint8Array([100, 97, 118, 105, 100]))
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(SetUserMetadataResponseSchema, {
      setDate: { nanos: 0, seconds: 1893456000n },
    })

    const jsonResult = messageSerialize(SetUserMetadataResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      setDate: "2030-01-01T00:00:00Z",
    })

    const yamlResult = messageSerialize(SetUserMetadataResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      setDate: "2030-01-01T00:00:00Z",
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

    const result = await userServiceSetUserMetadata({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        metadata: [{ key: "owner", value: new Uint8Array([100, 97, 118, 105, 100]) }],
        userId: "user-1",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceSetUserMetadata",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(SetUserMetadataResponseSchema, {
      setDate: { nanos: 0, seconds: 1893456000n },
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

    const result = await userServiceSetUserMetadata({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        metadata: [{ key: "owner", value: new Uint8Array([100, 97, 118, 105, 100]) }],
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
    expect(SetUserMetadataRequestSchema.typeName).toBe("zitadel.user.v2.SetUserMetadataRequest")
    expect(SetUserMetadataResponseSchema.typeName).toBe("zitadel.user.v2.SetUserMetadataResponse")
    expect(UserService.methods.find(({ localName }) => localName === "setUserMetadata")?.name).toBe("SetUserMetadata")
  })
})

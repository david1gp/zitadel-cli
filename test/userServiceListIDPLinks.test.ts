import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { usersListIDPLinksCommand } from "../src/cli/usersListIDPLinksCommand.js"
import {
  ListIDPLinksRequestSchema,
  ListIDPLinksResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userListIDPLinksRequestParse } from "../src/v2/userListIDPLinksRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceListIDPLinks } from "../src/v2/userServiceListIDPLinks.js"

describe("UserService.ListIDPLinks", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userListIDPLinksRequestParse({
      json: JSON.stringify({ userId: "user-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListIDPLinksResponseSchema, {
      result: [
        {
          idpId: "idp-1",
          userId: "user-1",
          userName: "user@example.com",
        },
      ],
    })

    const jsonResult = messageSerialize(ListIDPLinksResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      result: [{ idpId: "idp-1", userId: "user-1", userName: "user@example.com" }],
    })

    const yamlResult = messageSerialize(ListIDPLinksResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      result: [{ idpId: "idp-1", userId: "user-1", userName: "user@example.com" }],
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

    const result = await userServiceListIDPLinks({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceListIDPLinks",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListIDPLinksResponseSchema, {
      result: [{ idpId: "idp-1", userId: "user-1", userName: "user@example.com" }],
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

    const result = await userServiceListIDPLinks({
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
    expect(result.data.result[0]?.idpId).toBe("idp-1")
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
    expect(ListIDPLinksRequestSchema.typeName).toBe("zitadel.user.v2.ListIDPLinksRequest")
    expect(ListIDPLinksResponseSchema.typeName).toBe("zitadel.user.v2.ListIDPLinksResponse")
    expect(UserService.methods.find(({ localName }) => localName === "listIDPLinks")?.name).toBe("ListIDPLinks")
    expect(usersListIDPLinksCommand).toBeDefined()
  })
})

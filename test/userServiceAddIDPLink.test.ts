import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { AddIDPLinkRequestSchema, AddIDPLinkResponseSchema } from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { userAddIDPLinkRequestParse } from "../src/v2/userAddIDPLinkRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceAddIDPLink } from "../src/v2/userServiceAddIDPLink.js"

describe("UserService.AddIDPLink", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await userAddIDPLinkRequestParse({
      json: JSON.stringify({
        idpLink: {
          idpId: "idp-1",
          userId: "idp-user-1",
          userName: "idp-user",
        },
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.idpLink?.idpId).toBe("idp-1")
    expect(result.data.idpLink?.userId).toBe("idp-user-1")
    expect(result.data.idpLink?.userName).toBe("idp-user")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(AddIDPLinkResponseSchema, {
      details: { resourceOwner: "organization-1", sequence: 1n },
    })

    const jsonResult = messageSerialize(AddIDPLinkResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      details: {
        resourceOwner: "organization-1",
        sequence: "1",
      },
    })

    const yamlResult = messageSerialize(AddIDPLinkResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      details: {
        resourceOwner: "organization-1",
        sequence: "1",
      },
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

    const result = await userServiceAddIDPLink({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceAddIDPLink",
      errorMessage: "request failed",
    })
  })

  test("returns the typed add link response from the Connect client", async () => {
    const response = create(AddIDPLinkResponseSchema, {})
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

    const result = await userServiceAddIDPLink({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        idpLink: {
          idpId: "idp-1",
          userId: "idp-user-1",
          userName: "idp-user",
        },
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
    expect(AddIDPLinkRequestSchema.typeName).toBe("zitadel.user.v2.AddIDPLinkRequest")
    expect(AddIDPLinkResponseSchema.typeName).toBe("zitadel.user.v2.AddIDPLinkResponse")
    expect(UserService.methods.find(({ localName }) => localName === "addIDPLink")?.name).toBe("AddIDPLink")
  })
})

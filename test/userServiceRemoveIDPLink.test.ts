import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { usersRemoveIDPLinkCommand } from "../src/cli/usersRemoveIDPLinkCommand.js"
import {
  RemoveIDPLinkRequestSchema,
  RemoveIDPLinkResponseSchema,
  UserService,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { userRemoveIDPLinkRequestParse } from "../src/v2/userRemoveIDPLinkRequestParse.js"
import { userServiceRemoveIDPLink } from "../src/v2/userServiceRemoveIDPLink.js"

describe("UserService.RemoveIDPLink", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userRemoveIDPLinkRequestParse({
      json: JSON.stringify({ userId: "user-1", idpId: "idp-1", linkedUserId: "linked-user-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.idpId).toBe("idp-1")
    expect(result.data.linkedUserId).toBe("linked-user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(RemoveIDPLinkResponseSchema, {
      details: { resourceOwner: "organization-1", sequence: 1n },
    })

    const jsonResult = messageSerialize(RemoveIDPLinkResponseSchema, response, "json")
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

    const yamlResult = messageSerialize(RemoveIDPLinkResponseSchema, response, "yaml")
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

    const result = await userServiceRemoveIDPLink({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1", idpId: "idp-1", linkedUserId: "linked-user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceRemoveIDPLink",
      errorMessage: "request failed",
    })
  })

  test("returns the typed generated response from the Connect client", async () => {
    const response = create(RemoveIDPLinkResponseSchema, {})
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

    const result = await userServiceRemoveIDPLink({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1", idpId: "idp-1", linkedUserId: "linked-user-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data).toBe(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(RemoveIDPLinkRequestSchema.typeName).toBe("zitadel.user.v2.RemoveIDPLinkRequest")
    expect(RemoveIDPLinkResponseSchema.typeName).toBe("zitadel.user.v2.RemoveIDPLinkResponse")
    expect(UserService.methods.find(({ localName }) => localName === "removeIDPLink")?.name).toBe("RemoveIDPLink")
    expect(usersRemoveIDPLinkCommand).toBeDefined()
  })
})

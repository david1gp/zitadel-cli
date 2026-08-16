import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ActionService,
  ListPublicKeysRequestSchema,
  ListPublicKeysResponseSchema,
} from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { actionListPublicKeysRequestParse } from "../src/v2/actionListPublicKeysRequestParse.js"
import { actionServiceListPublicKeys } from "../src/v2/actionServiceListPublicKeys.js"

describe("ActionService.ListPublicKeys", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await actionListPublicKeysRequestParse({
      json: JSON.stringify({
        filters: [
          {
            keyIdsFilter: {
              ids: ["key-1"],
            },
          },
          {
            activeFilter: true,
          },
        ],
        pagination: {
          asc: true,
          limit: 25,
          offset: "2",
        },
        sortingColumn: "PUBLIC_KEY_FIELD_NAME_EXPIRATION_DATE",
        targetId: "target-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.targetId).toBe("target-1")
    expect(result.data.pagination?.asc).toBe(true)
    expect(result.data.pagination?.limit).toBe(25)
    expect(result.data.pagination?.offset).toBe(2n)
    expect(result.data.sortingColumn).toBe(3)

    const idsFilter = result.data.filters?.[0]
    expect(idsFilter?.filter?.case).toBe("keyIdsFilter")
    if (idsFilter?.filter === undefined || idsFilter.filter.case !== "keyIdsFilter") {
      return
    }
    expect(idsFilter.filter.value.ids).toEqual(["key-1"])

    const activeFilter = result.data.filters?.[1]
    expect(activeFilter?.filter?.case).toBe("activeFilter")
    if (activeFilter?.filter === undefined || activeFilter.filter.case !== "activeFilter") {
      return
    }
    expect(activeFilter.filter.value).toBe(true)
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListPublicKeysResponseSchema, {
      publicKeys: [{ keyId: "key-1" }],
    })

    const jsonResult = messageSerialize(ListPublicKeysResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      publicKeys: [{ keyId: "key-1" }],
    })

    const yamlResult = messageSerialize(ListPublicKeysResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      publicKeys: [{ keyId: "key-1" }],
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

    const result = await actionServiceListPublicKeys({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "actionServiceListPublicKeys",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListPublicKeysResponseSchema, {
      publicKeys: [{ keyId: "key-1" }],
    })
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async () => ({
        header: new Headers(),
        message: response,
        service: ActionService,
        stream: false,
        trailer: new Headers(),
      }),
    } as unknown as Transport

    const result = await actionServiceListPublicKeys({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { targetId: "target-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.publicKeys[0]?.keyId).toBe("key-1")
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
    expect(ListPublicKeysRequestSchema.typeName).toBe("zitadel.action.v2.ListPublicKeysRequest")
    expect(ListPublicKeysResponseSchema.typeName).toBe("zitadel.action.v2.ListPublicKeysResponse")
    expect(ActionService.methods.find(({ localName }) => localName === "listPublicKeys")?.name).toBe("ListPublicKeys")
  })
})

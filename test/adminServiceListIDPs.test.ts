import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { ListIDPsRequestSchema, ListIDPsResponseSchema } from "../src/generated/zitadel/admin_pb.js"
import { IDPSchema } from "../src/generated/zitadel/idp_pb.js"
import { adminListIDPsCommand } from "../src/legacy_v1/adminListIDPsCommand.js"
import { adminListIDPsRequestParse } from "../src/legacy_v1/adminListIDPsRequestParse.js"
import { adminServiceListIDPs } from "../src/legacy_v1/adminServiceListIDPs.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"

const config = {
  baseUrl: "https://example.test",
  token: "token",
}

describe("legacy AdminService.ListIDPs", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await adminListIDPsRequestParse({
      json: JSON.stringify({
        query: { offset: "2", limit: 25, asc: true },
        sortingColumn: "IDP_FIELD_NAME_NAME",
        queries: [
          { idpIdQuery: { id: "idp-1" } },
          { idpNameQuery: { name: "Example", method: "TEXT_QUERY_METHOD_CONTAINS" } },
        ],
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.query?.offset).toBe(2n)
    expect(result.data.query?.limit).toBe(25)
    expect(result.data.query?.asc).toBe(true)
    expect(result.data.sortingColumn).toBe(1)
    const queries = result.data.queries ?? []
    expect(queries[0]?.query?.case).toBe("idpIdQuery")
    expect(queries[1]?.query?.case).toBe("idpNameQuery")
  })

  test("serializes the generated response as JSON and YAML", () => {
    const response = create(ListIDPsResponseSchema, {
      result: [create(IDPSchema, { id: "idp-1", name: "Example" })],
      sortingColumn: 1,
    })

    const jsonResult = messageSerialize(ListIDPsResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      sortingColumn: "IDP_FIELD_NAME_NAME",
      result: [expect.objectContaining({ id: "idp-1", name: "Example" })],
    })

    const yamlResult = messageSerialize(ListIDPsResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual(
      expect.objectContaining({
        sortingColumn: "IDP_FIELD_NAME_NAME",
        result: [expect.objectContaining({ id: "idp-1", name: "Example" })],
      }),
    )
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

    const result = await adminServiceListIDPs({ config, transport })

    expect(result).toEqual({
      success: false,
      op: "adminServiceListIDPs",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListIDPsResponseSchema, {
      result: [create(IDPSchema, { id: "idp-1", name: "Example" })],
    })
    let receivedMethod = ""
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async (method: { readonly name: string }) => {
        receivedMethod = method.name
        return {
          header: new Headers(),
          message: response,
          service: undefined,
          stream: false,
          trailer: new Headers(),
        }
      },
    } as unknown as Transport

    const result = await adminServiceListIDPs({ config, request: { sortingColumn: 1 }, transport })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(receivedMethod).toBe("ListIDPs")
    expect(result.data.result[0]?.id).toBe("idp-1")
  })

  test("adds the bearer token to Connect requests", async () => {
    const request = { header: new Headers() } as unknown as UnaryRequest
    const next = async (received: UnaryRequest | StreamRequest): Promise<UnaryResponse> => {
      expect(received.header.get("Authorization")).toBe("Bearer bearer-token")
      return {} as UnaryResponse
    }

    await zitadelBearerInterceptorCreate("bearer-token")(next)(request)
  })

  test("exposes only the ListIDPs endpoint command", () => {
    expect(ListIDPsRequestSchema.typeName).toBe("zitadel.admin.v1.ListIDPsRequest")
    expect(ListIDPsResponseSchema.typeName).toBe("zitadel.admin.v1.ListIDPsResponse")
    expect(adminListIDPsCommand).toBeDefined()
  })
})

import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ListOrganizationsRequestSchema,
  ListOrganizationsResponseSchema,
  OrganizationService,
} from "../src/generated/zitadel/org/v2/org_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { organizationListOrganizationsRequestParse } from "../src/v2/organizationListOrganizationsRequestParse.js"
import { organizationServiceListOrganizations } from "../src/v2/organizationServiceListOrganizations.js"

describe("OrganizationService.ListOrganizations", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await organizationListOrganizationsRequestParse({
      json: JSON.stringify({
        queries: [
          {
            nameQuery: {
              method: "TEXT_QUERY_METHOD_EQUALS",
              name: "Example",
            },
          },
        ],
        query: {
          asc: true,
          limit: 25,
          offset: "2",
        },
        sortingColumn: "ORGANIZATION_FIELD_NAME_NAME",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.query?.asc).toBe(true)
    expect(result.data.query?.limit).toBe(25)
    expect(result.data.query?.offset).toBe(2n)
    expect(result.data.sortingColumn).toBe(1)
    expect(result.data.queries?.[0]?.query?.case).toBe("nameQuery")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListOrganizationsResponseSchema, {
      result: [{ id: "organization-1", name: "Example" }],
    })

    const jsonResult = messageSerialize(ListOrganizationsResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      result: [{ id: "organization-1", name: "Example" }],
    })

    const yamlResult = messageSerialize(ListOrganizationsResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      result: [{ id: "organization-1", name: "Example" }],
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

    const result = await organizationServiceListOrganizations({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "organizationServiceListOrganizations",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListOrganizationsResponseSchema, {
      result: [{ id: "organization-1", name: "Example" }],
    })
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async () => ({
        header: new Headers(),
        message: response,
        service: OrganizationService,
        stream: false,
        trailer: new Headers(),
      }),
    } as unknown as Transport

    const result = await organizationServiceListOrganizations({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { sortingColumn: 1 },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.result[0]?.id).toBe("organization-1")
  })

  test("exposes the generated request and response descriptors", () => {
    expect(ListOrganizationsRequestSchema.typeName).toBe("zitadel.org.v2.ListOrganizationsRequest")
    expect(ListOrganizationsResponseSchema.typeName).toBe("zitadel.org.v2.ListOrganizationsResponse")
    expect(OrganizationService.methods.find(({ localName }) => localName === "listOrganizations")?.name).toBe(
      "ListOrganizations",
    )
  })
})

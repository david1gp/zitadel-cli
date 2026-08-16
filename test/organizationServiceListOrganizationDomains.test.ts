import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ListOrganizationDomainsRequestSchema,
  ListOrganizationDomainsResponseSchema,
  OrganizationService,
} from "../src/generated/zitadel/org/v2/org_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { organizationListOrganizationDomainsRequestParse } from "../src/v2/organizationListOrganizationDomainsRequestParse.js"
import { organizationServiceListOrganizationDomains } from "../src/v2/organizationServiceListOrganizationDomains.js"

describe("OrganizationService.ListOrganizationDomains", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await organizationListOrganizationDomainsRequestParse({
      json: JSON.stringify({
        filters: [
          {
            domainFilter: {
              domain: "example.com",
              method: "TEXT_QUERY_METHOD_EQUALS",
            },
          },
        ],
        organizationId: "organization-1",
        pagination: {
          asc: true,
          limit: 25,
          offset: "2",
        },
        sortingColumn: "DOMAIN_FIELD_NAME_NAME",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.organizationId).toBe("organization-1")
    expect(result.data.pagination?.asc).toBe(true)
    expect(result.data.pagination?.limit).toBe(25)
    expect(result.data.pagination?.offset).toBe(2n)
    expect(result.data.sortingColumn).toBe(1)

    const filter = result.data.filters?.[0]
    expect(filter?.filter?.case).toBe("domainFilter")
    if (filter?.filter === undefined || filter.filter.case !== "domainFilter") {
      return
    }
    expect(filter.filter.value.domain).toBe("example.com")
    expect(filter.filter.value.method).toBe(0)
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListOrganizationDomainsResponseSchema, {
      domains: [
        {
          domain: "example.com",
          isPrimary: true,
          isVerified: true,
          organizationId: "organization-1",
          validationType: 1,
        },
      ],
    })

    const jsonResult = messageSerialize(ListOrganizationDomainsResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      domains: [
        {
          domain: "example.com",
          isPrimary: true,
          isVerified: true,
          organizationId: "organization-1",
          validationType: "DOMAIN_VALIDATION_TYPE_HTTP",
        },
      ],
    })

    const yamlResult = messageSerialize(ListOrganizationDomainsResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      domains: [
        {
          domain: "example.com",
          isPrimary: true,
          isVerified: true,
          organizationId: "organization-1",
          validationType: "DOMAIN_VALIDATION_TYPE_HTTP",
        },
      ],
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

    const result = await organizationServiceListOrganizationDomains({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "organizationServiceListOrganizationDomains",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListOrganizationDomainsResponseSchema, {
      domains: [
        {
          domain: "example.com",
          isPrimary: true,
          isVerified: true,
          organizationId: "organization-1",
          validationType: 1,
        },
      ],
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

    const result = await organizationServiceListOrganizationDomains({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { organizationId: "organization-1", sortingColumn: 1 },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.domains[0]?.domain).toBe("example.com")
  })

  test("exposes the generated request and response descriptors", () => {
    expect(ListOrganizationDomainsRequestSchema.typeName).toBe("zitadel.org.v2.ListOrganizationDomainsRequest")
    expect(ListOrganizationDomainsResponseSchema.typeName).toBe("zitadel.org.v2.ListOrganizationDomainsResponse")
    expect(OrganizationService.methods.find(({ localName }) => localName === "listOrganizationDomains")?.name).toBe(
      "ListOrganizationDomains",
    )
  })
})

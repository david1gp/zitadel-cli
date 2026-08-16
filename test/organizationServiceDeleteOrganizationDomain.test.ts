import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  DeleteOrganizationDomainRequestSchema,
  DeleteOrganizationDomainResponseSchema,
  OrganizationService,
} from "../src/generated/zitadel/org/v2/org_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { organizationDeleteOrganizationDomainRequestParse } from "../src/v2/organizationDeleteOrganizationDomainRequestParse.js"
import { organizationServiceDeleteOrganizationDomain } from "../src/v2/organizationServiceDeleteOrganizationDomain.js"

describe("OrganizationService.DeleteOrganizationDomain", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await organizationDeleteOrganizationDomainRequestParse({
      json: JSON.stringify({
        domain: "example.com",
        organizationId: "organization-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.organizationId).toBe("organization-1")
    expect(result.data.domain).toBe("example.com")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(DeleteOrganizationDomainResponseSchema, {})

    const jsonResult = messageSerialize(DeleteOrganizationDomainResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(DeleteOrganizationDomainResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({})
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

    const result = await organizationServiceDeleteOrganizationDomain({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        domain: "example.com",
        organizationId: "organization-1",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "organizationServiceDeleteOrganizationDomain",
      errorMessage: "request failed",
    })
  })

  test("returns the typed delete response from the Connect client", async () => {
    const response = create(DeleteOrganizationDomainResponseSchema, {})
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

    const result = await organizationServiceDeleteOrganizationDomain({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        domain: "example.com",
        organizationId: "organization-1",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toEqual(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(DeleteOrganizationDomainRequestSchema.typeName).toBe("zitadel.org.v2.DeleteOrganizationDomainRequest")
    expect(DeleteOrganizationDomainResponseSchema.typeName).toBe("zitadel.org.v2.DeleteOrganizationDomainResponse")
    expect(OrganizationService.methods.find(({ localName }) => localName === "deleteOrganizationDomain")?.name).toBe(
      "DeleteOrganizationDomain",
    )
  })
})

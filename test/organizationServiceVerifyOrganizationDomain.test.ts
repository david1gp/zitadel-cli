import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  OrganizationService,
  VerifyOrganizationDomainRequestSchema,
  VerifyOrganizationDomainResponseSchema,
} from "../src/generated/zitadel/org/v2/org_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { organizationServiceVerifyOrganizationDomain } from "../src/v2/organizationServiceVerifyOrganizationDomain.js"
import { organizationVerifyOrganizationDomainRequestParse } from "../src/v2/organizationVerifyOrganizationDomainRequestParse.js"

describe("OrganizationService.VerifyOrganizationDomain", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await organizationVerifyOrganizationDomainRequestParse({
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
    const response = create(VerifyOrganizationDomainResponseSchema, {
      changeDate: { nanos: 0, seconds: 1893456000n },
    })

    const jsonResult = messageSerialize(VerifyOrganizationDomainResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ changeDate: "2030-01-01T00:00:00Z" })

    const yamlResult = messageSerialize(VerifyOrganizationDomainResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ changeDate: "2030-01-01T00:00:00Z" })
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

    const result = await organizationServiceVerifyOrganizationDomain({
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
      op: "organizationServiceVerifyOrganizationDomain",
      errorMessage: "request failed",
    })
  })

  test("returns the typed verification response from the Connect client", async () => {
    const response = create(VerifyOrganizationDomainResponseSchema, {
      changeDate: { nanos: 0, seconds: 1893456000n },
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

    const result = await organizationServiceVerifyOrganizationDomain({
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
    expect(result.data).toBe(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(VerifyOrganizationDomainRequestSchema.typeName).toBe("zitadel.org.v2.VerifyOrganizationDomainRequest")
    expect(VerifyOrganizationDomainResponseSchema.typeName).toBe("zitadel.org.v2.VerifyOrganizationDomainResponse")
    expect(OrganizationService.methods.find(({ localName }) => localName === "verifyOrganizationDomain")?.name).toBe(
      "VerifyOrganizationDomain",
    )
  })
})

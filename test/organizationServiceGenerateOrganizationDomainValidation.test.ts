import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  GenerateOrganizationDomainValidationRequestSchema,
  GenerateOrganizationDomainValidationResponseSchema,
  OrganizationService,
} from "../src/generated/zitadel/org/v2/org_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { organizationGenerateOrganizationDomainValidationRequestParse } from "../src/v2/organizationGenerateOrganizationDomainValidationRequestParse.js"
import { organizationServiceGenerateOrganizationDomainValidation } from "../src/v2/organizationServiceGenerateOrganizationDomainValidation.js"

describe("OrganizationService.GenerateOrganizationDomainValidation", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await organizationGenerateOrganizationDomainValidationRequestParse({
      json: JSON.stringify({
        domain: "example.test",
        organizationId: "organization-1",
        type: "DOMAIN_VALIDATION_TYPE_DNS",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.organizationId).toBe("organization-1")
    expect(result.data.domain).toBe("example.test")
    expect(result.data.type).toBe(2)
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(GenerateOrganizationDomainValidationResponseSchema, {
      token: "validation-token",
      url: "https://example.test/.well-known/zitadel-challenge",
    })

    const jsonResult = messageSerialize(GenerateOrganizationDomainValidationResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      token: "validation-token",
      url: "https://example.test/.well-known/zitadel-challenge",
    })

    const yamlResult = messageSerialize(GenerateOrganizationDomainValidationResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      token: "validation-token",
      url: "https://example.test/.well-known/zitadel-challenge",
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

    const result = await organizationServiceGenerateOrganizationDomainValidation({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "organizationServiceGenerateOrganizationDomainValidation",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(GenerateOrganizationDomainValidationResponseSchema, {
      token: "validation-token",
      url: "https://example.test/.well-known/zitadel-challenge",
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

    const result = await organizationServiceGenerateOrganizationDomainValidation({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        domain: "example.test",
        organizationId: "organization-1",
        type: 2,
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.token).toBe("validation-token")
    expect(result.data.url).toBe("https://example.test/.well-known/zitadel-challenge")
  })

  test("exposes the generated request and response descriptors", () => {
    expect(GenerateOrganizationDomainValidationRequestSchema.typeName).toBe(
      "zitadel.org.v2.GenerateOrganizationDomainValidationRequest",
    )
    expect(GenerateOrganizationDomainValidationResponseSchema.typeName).toBe(
      "zitadel.org.v2.GenerateOrganizationDomainValidationResponse",
    )
    expect(
      OrganizationService.methods.find(({ localName }) => localName === "generateOrganizationDomainValidation")?.name,
    ).toBe("GenerateOrganizationDomainValidation")
  })
})

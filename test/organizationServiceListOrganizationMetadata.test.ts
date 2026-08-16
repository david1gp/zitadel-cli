import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ListOrganizationMetadataRequestSchema,
  ListOrganizationMetadataResponseSchema,
  OrganizationService,
} from "../src/generated/zitadel/org/v2/org_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { organizationListOrganizationMetadataRequestParse } from "../src/v2/organizationListOrganizationMetadataRequestParse.js"
import { organizationServiceListOrganizationMetadata } from "../src/v2/organizationServiceListOrganizationMetadata.js"

describe("OrganizationService.ListOrganizationMetadata", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await organizationListOrganizationMetadataRequestParse({
      json: JSON.stringify({
        filters: [{ keyFilter: { key: "role", method: "TEXT_FILTER_METHOD_EQUALS" } }],
        organizationId: "organization-1",
        pagination: { asc: true, limit: 25, offset: "2" },
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
    expect(result.data.filters?.[0]?.filter?.case).toBe("keyFilter")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListOrganizationMetadataResponseSchema, {
      metadata: [{ key: "role", value: new Uint8Array([118, 97, 108, 117, 101]) }],
    })

    const jsonResult = messageSerialize(ListOrganizationMetadataResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      metadata: [{ key: "role", value: "dmFsdWU=" }],
    })

    const yamlResult = messageSerialize(ListOrganizationMetadataResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      metadata: [{ key: "role", value: "dmFsdWU=" }],
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

    const result = await organizationServiceListOrganizationMetadata({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { organizationId: "organization-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "organizationServiceListOrganizationMetadata",
      errorMessage: "request failed",
    })
  })

  test("returns the typed metadata response from the Connect client", async () => {
    const response = create(ListOrganizationMetadataResponseSchema, {
      metadata: [{ key: "role", value: new Uint8Array([118, 97, 108, 117, 101]) }],
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

    const result = await organizationServiceListOrganizationMetadata({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { organizationId: "organization-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.metadata[0]?.key).toBe("role")
  })

  test("exposes the generated request and response descriptors", () => {
    expect(ListOrganizationMetadataRequestSchema.typeName).toBe("zitadel.org.v2.ListOrganizationMetadataRequest")
    expect(ListOrganizationMetadataResponseSchema.typeName).toBe("zitadel.org.v2.ListOrganizationMetadataResponse")
    expect(OrganizationService.methods.find(({ localName }) => localName === "listOrganizationMetadata")?.name).toBe(
      "ListOrganizationMetadata",
    )
  })
})

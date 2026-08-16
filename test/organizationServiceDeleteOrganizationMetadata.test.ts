import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  DeleteOrganizationMetadataRequestSchema,
  DeleteOrganizationMetadataResponseSchema,
  OrganizationService,
} from "../src/generated/zitadel/org/v2/org_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { organizationDeleteOrganizationMetadataRequestParse } from "../src/v2/organizationDeleteOrganizationMetadataRequestParse.js"
import { organizationServiceDeleteOrganizationMetadata } from "../src/v2/organizationServiceDeleteOrganizationMetadata.js"

describe("OrganizationService.DeleteOrganizationMetadata", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await organizationDeleteOrganizationMetadataRequestParse({
      json: JSON.stringify({ organizationId: "organization-1", keys: ["key-a", "key-b"] }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.organizationId).toBe("organization-1")
    expect(result.data.keys).toEqual(["key-a", "key-b"])
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(DeleteOrganizationMetadataResponseSchema, {})

    const jsonResult = messageSerialize(DeleteOrganizationMetadataResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(DeleteOrganizationMetadataResponseSchema, response, "yaml")
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

    const result = await organizationServiceDeleteOrganizationMetadata({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { keys: ["key-a"], organizationId: "organization-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "organizationServiceDeleteOrganizationMetadata",
      errorMessage: "request failed",
    })
  })

  test("returns the typed delete metadata response from the Connect client", async () => {
    const response = create(DeleteOrganizationMetadataResponseSchema, {})
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

    const result = await organizationServiceDeleteOrganizationMetadata({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { keys: ["key-a", "key-b"], organizationId: "organization-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toBe(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(DeleteOrganizationMetadataRequestSchema.typeName).toBe("zitadel.org.v2.DeleteOrganizationMetadataRequest")
    expect(DeleteOrganizationMetadataResponseSchema.typeName).toBe("zitadel.org.v2.DeleteOrganizationMetadataResponse")
    expect(OrganizationService.methods.find(({ localName }) => localName === "deleteOrganizationMetadata")?.name).toBe(
      "DeleteOrganizationMetadata",
    )
  })
})

import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  DeleteOrganizationRequestSchema,
  DeleteOrganizationResponseSchema,
  OrganizationService,
} from "../src/generated/zitadel/org/v2/org_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { organizationDeleteOrganizationRequestParse } from "../src/v2/organizationDeleteOrganizationRequestParse.js"
import { organizationServiceDeleteOrganization } from "../src/v2/organizationServiceDeleteOrganization.js"

describe("OrganizationService.DeleteOrganization", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await organizationDeleteOrganizationRequestParse({
      json: JSON.stringify({ organizationId: "organization-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.organizationId).toBe("organization-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(DeleteOrganizationResponseSchema, {})

    const jsonResult = messageSerialize(DeleteOrganizationResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(DeleteOrganizationResponseSchema, response, "yaml")
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

    const result = await organizationServiceDeleteOrganization({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { organizationId: "organization-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "organizationServiceDeleteOrganization",
      errorMessage: "request failed",
    })
  })

  test("returns the typed delete response from the Connect client", async () => {
    const response = create(DeleteOrganizationResponseSchema, {})
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

    const result = await organizationServiceDeleteOrganization({
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
    expect(result.data).toEqual(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(DeleteOrganizationRequestSchema.typeName).toBe("zitadel.org.v2.DeleteOrganizationRequest")
    expect(DeleteOrganizationResponseSchema.typeName).toBe("zitadel.org.v2.DeleteOrganizationResponse")
    expect(OrganizationService.methods.find(({ localName }) => localName === "deleteOrganization")?.name).toBe(
      "DeleteOrganization",
    )
  })
})

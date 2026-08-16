import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { organizationsActivateCommand } from "../src/cli/organizationsActivateCommand.js"
import {
  ActivateOrganizationRequestSchema,
  ActivateOrganizationResponseSchema,
  OrganizationService,
} from "../src/generated/zitadel/org/v2/org_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { organizationActivateOrganizationRequestParse } from "../src/v2/organizationActivateOrganizationRequestParse.js"
import { organizationServiceActivateOrganization } from "../src/v2/organizationServiceActivateOrganization.js"

describe("OrganizationService.ActivateOrganization", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await organizationActivateOrganizationRequestParse({
      json: JSON.stringify({ organizationId: "organization-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.organizationId).toBe("organization-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ActivateOrganizationResponseSchema, {})

    const jsonResult = messageSerialize(ActivateOrganizationResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(ActivateOrganizationResponseSchema, response, "yaml")
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

    const result = await organizationServiceActivateOrganization({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { organizationId: "organization-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "organizationServiceActivateOrganization",
      errorMessage: "request failed",
    })
  })

  test("returns the typed activate response from the Connect client", async () => {
    const response = create(ActivateOrganizationResponseSchema, {})
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

    const result = await organizationServiceActivateOrganization({
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

  test("builds the CLI command", () => {
    expect(organizationsActivateCommand).toBeDefined()
  })

  test("exposes the generated request and response descriptors", () => {
    expect(ActivateOrganizationRequestSchema.typeName).toBe("zitadel.org.v2.ActivateOrganizationRequest")
    expect(ActivateOrganizationResponseSchema.typeName).toBe("zitadel.org.v2.ActivateOrganizationResponse")
    expect(OrganizationService.methods.find(({ localName }) => localName === "activateOrganization")?.name).toBe(
      "ActivateOrganization",
    )
  })
})

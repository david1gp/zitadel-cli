import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { organizationsDeactivateCommand } from "../src/cli/organizationsDeactivateCommand.js"
import {
  DeactivateOrganizationRequestSchema,
  DeactivateOrganizationResponseSchema,
  OrganizationService,
} from "../src/generated/zitadel/org/v2/org_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { organizationDeactivateOrganizationRequestParse } from "../src/v2/organizationDeactivateOrganizationRequestParse.js"
import { organizationServiceDeactivateOrganization } from "../src/v2/organizationServiceDeactivateOrganization.js"

describe("OrganizationService.DeactivateOrganization", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await organizationDeactivateOrganizationRequestParse({
      json: JSON.stringify({ organizationId: "organization-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.organizationId).toBe("organization-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(DeactivateOrganizationResponseSchema, {
      changeDate: { nanos: 0, seconds: 1n },
    })

    const jsonResult = messageSerialize(DeactivateOrganizationResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ changeDate: "1970-01-01T00:00:01Z" })

    const yamlResult = messageSerialize(DeactivateOrganizationResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ changeDate: "1970-01-01T00:00:01Z" })
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

    const result = await organizationServiceDeactivateOrganization({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { organizationId: "organization-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "organizationServiceDeactivateOrganization",
      errorMessage: "request failed",
    })
  })

  test("returns the typed deactivate response from the Connect client", async () => {
    const response = create(DeactivateOrganizationResponseSchema, {
      changeDate: { nanos: 0, seconds: 1n },
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

    const result = await organizationServiceDeactivateOrganization({
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
    expect(result.data.changeDate?.seconds).toBe(1n)
  })

  test("defines the endpoint command", () => {
    expect(organizationsDeactivateCommand).toBeDefined()
  })

  test("exposes the generated request and response descriptors", () => {
    expect(DeactivateOrganizationRequestSchema.typeName).toBe("zitadel.org.v2.DeactivateOrganizationRequest")
    expect(DeactivateOrganizationResponseSchema.typeName).toBe("zitadel.org.v2.DeactivateOrganizationResponse")
    expect(OrganizationService.methods.find(({ localName }) => localName === "deactivateOrganization")?.name).toBe(
      "DeactivateOrganization",
    )
  })
})

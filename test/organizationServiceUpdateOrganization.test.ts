import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  OrganizationService,
  UpdateOrganizationRequestSchema,
  UpdateOrganizationResponseSchema,
} from "../src/generated/zitadel/org/v2/org_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { organizationServiceUpdateOrganization } from "../src/v2/organizationServiceUpdateOrganization.js"
import { organizationUpdateOrganizationRequestParse } from "../src/v2/organizationUpdateOrganizationRequestParse.js"

describe("OrganizationService.UpdateOrganization", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await organizationUpdateOrganizationRequestParse({
      json: JSON.stringify({
        name: "Updated organization",
        organizationId: "organization-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.organizationId).toBe("organization-1")
    expect(result.data.name).toBe("Updated organization")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(UpdateOrganizationResponseSchema, {
      changeDate: { nanos: 0, seconds: 1673746215n },
    })

    const jsonResult = messageSerialize(UpdateOrganizationResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ changeDate: "2023-01-15T01:30:15Z" })

    const yamlResult = messageSerialize(UpdateOrganizationResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ changeDate: "2023-01-15T01:30:15Z" })
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

    const result = await organizationServiceUpdateOrganization({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "organizationServiceUpdateOrganization",
      errorMessage: "request failed",
    })
  })

  test("returns the typed update response from the Connect client", async () => {
    const response = create(UpdateOrganizationResponseSchema, {})
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

    const result = await organizationServiceUpdateOrganization({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        name: "Updated organization",
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

  test("adds the bearer token to Connect requests", async () => {
    const request = { header: new Headers() } as unknown as UnaryRequest
    const next = async (received: UnaryRequest | StreamRequest): Promise<UnaryResponse> => {
      expect(received.header.get("Authorization")).toBe("Bearer bearer-token")
      return {} as UnaryResponse
    }

    await zitadelBearerInterceptorCreate("bearer-token")(next)(request)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(UpdateOrganizationRequestSchema.typeName).toBe("zitadel.org.v2.UpdateOrganizationRequest")
    expect(UpdateOrganizationResponseSchema.typeName).toBe("zitadel.org.v2.UpdateOrganizationResponse")
    expect(OrganizationService.methods.find(({ localName }) => localName === "updateOrganization")?.name).toBe(
      "UpdateOrganization",
    )
  })
})

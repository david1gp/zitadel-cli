import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  AddOrganizationRequestSchema,
  AddOrganizationResponseSchema,
  OrganizationService,
} from "../src/generated/zitadel/org/v2/org_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { organizationAddOrganizationRequestParse } from "../src/v2/organizationAddOrganizationRequestParse.js"
import { organizationServiceAddOrganization } from "../src/v2/organizationServiceAddOrganization.js"

describe("OrganizationService.AddOrganization", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await organizationAddOrganizationRequestParse({
      json: JSON.stringify({
        admins: [
          {
            roles: ["ORG_OWNER"],
            userId: "user-1",
          },
        ],
        name: "Example",
        organizationId: "organization-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.name).toBe("Example")
    expect(result.data.organizationId).toBe("organization-1")
    expect(result.data.admins?.[0]?.roles).toEqual(["ORG_OWNER"])
    expect(result.data.admins?.[0]?.userType).toEqual({
      case: "userId",
      value: "user-1",
    })
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(AddOrganizationResponseSchema, {
      createdAdmins: [{ userId: "user-1" }],
      organizationId: "organization-1",
    })

    const jsonResult = messageSerialize(AddOrganizationResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      createdAdmins: [{ userId: "user-1" }],
      organizationId: "organization-1",
    })

    const yamlResult = messageSerialize(AddOrganizationResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      createdAdmins: [{ userId: "user-1" }],
      organizationId: "organization-1",
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

    const result = await organizationServiceAddOrganization({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "organizationServiceAddOrganization",
      errorMessage: "request failed",
    })
  })

  test("returns the typed add response from the Connect client", async () => {
    const response = create(AddOrganizationResponseSchema, {
      organizationId: "organization-1",
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

    const result = await organizationServiceAddOrganization({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { name: "Example" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.organizationId).toBe("organization-1")
  })

  test("exposes the generated request and response descriptors", () => {
    expect(AddOrganizationRequestSchema.typeName).toBe("zitadel.org.v2.AddOrganizationRequest")
    expect(AddOrganizationResponseSchema.typeName).toBe("zitadel.org.v2.AddOrganizationResponse")
    expect(OrganizationService.methods.find(({ localName }) => localName === "addOrganization")?.name).toBe(
      "AddOrganization",
    )
  })
})

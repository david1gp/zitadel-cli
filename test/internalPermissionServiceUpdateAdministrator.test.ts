import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  InternalPermissionService,
  UpdateAdministratorRequestSchema,
  UpdateAdministratorResponseSchema,
} from "../src/generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { internalPermissionUpdateAdministratorRequestParse } from "../src/v2/internalPermissionUpdateAdministratorRequestParse.js"
import { internalPermissionServiceUpdateAdministrator } from "../src/v2/internalPermissionServiceUpdateAdministrator.js"

describe("InternalPermissionService.UpdateAdministrator", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await internalPermissionUpdateAdministratorRequestParse({
      json: JSON.stringify({
        resource: {
          organizationId: "organization-1",
        },
        roles: ["ORG_OWNER"],
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    expect(result.data.roles).toEqual(["ORG_OWNER"])
    const resource = result.data.resource?.resource
    expect(resource?.case).toBe("organizationId")
    if (resource?.case !== "organizationId") {
      return
    }
    expect(resource.value).toBe("organization-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(UpdateAdministratorResponseSchema, {
      changeDate: { nanos: 0, seconds: 1893456000n },
    })

    const jsonResult = messageSerialize(UpdateAdministratorResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ changeDate: "2030-01-01T00:00:00Z" })

    const yamlResult = messageSerialize(UpdateAdministratorResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual(JSON.parse(jsonResult.data))
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

    const result = await internalPermissionServiceUpdateAdministrator({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "internalPermissionServiceUpdateAdministrator",
      errorMessage: "request failed",
    })
  })

  test("returns the typed update response from the Connect client", async () => {
    const response = create(UpdateAdministratorResponseSchema, {
      changeDate: { nanos: 0, seconds: 1893456000n },
    })
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async () => ({
        header: new Headers(),
        message: response,
        service: InternalPermissionService,
        stream: false,
        trailer: new Headers(),
      }),
    } as unknown as Transport

    const result = await internalPermissionServiceUpdateAdministrator({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        resource: { resource: { case: "instance", value: true } },
        roles: ["IAM_OWNER"],
        userId: "user-1",
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
    expect(UpdateAdministratorRequestSchema.typeName).toBe("zitadel.internal_permission.v2.UpdateAdministratorRequest")
    expect(UpdateAdministratorResponseSchema.typeName).toBe(
      "zitadel.internal_permission.v2.UpdateAdministratorResponse",
    )
    expect(InternalPermissionService.methods.find(({ localName }) => localName === "updateAdministrator")?.name).toBe(
      "UpdateAdministrator",
    )
  })
})

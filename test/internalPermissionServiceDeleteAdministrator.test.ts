import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  DeleteAdministratorRequestSchema,
  DeleteAdministratorResponseSchema,
  InternalPermissionService,
} from "../src/generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { internalPermissionDeleteAdministratorRequestParse } from "../src/v2/internalPermissionDeleteAdministratorRequestParse.js"
import { internalPermissionServiceDeleteAdministrator } from "../src/v2/internalPermissionServiceDeleteAdministrator.js"

describe("InternalPermissionService.DeleteAdministrator", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await internalPermissionDeleteAdministratorRequestParse({
      json: JSON.stringify({
        resource: { organizationId: "org-1" },
        userId: "user-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
    const resource = result.data.resource?.resource
    expect(resource?.case).toBe("organizationId")
    if (resource?.case !== "organizationId") {
      return
    }
    expect(resource.value).toBe("org-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(DeleteAdministratorResponseSchema, {
      deletionDate: { nanos: 0, seconds: 1893456000n },
    })

    const jsonResult = messageSerialize(DeleteAdministratorResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ deletionDate: "2030-01-01T00:00:00Z" })

    const yamlResult = messageSerialize(DeleteAdministratorResponseSchema, response, "yaml")
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

    const result = await internalPermissionServiceDeleteAdministrator({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "internalPermissionServiceDeleteAdministrator",
      errorMessage: "request failed",
    })
  })

  test("returns the typed delete response from the Connect client", async () => {
    const response = create(DeleteAdministratorResponseSchema, {
      deletionDate: { seconds: 1893456000n },
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

    const result = await internalPermissionServiceDeleteAdministrator({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.deletionDate?.seconds).toBe(1893456000n)
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
    expect(DeleteAdministratorRequestSchema.typeName).toBe("zitadel.internal_permission.v2.DeleteAdministratorRequest")
    expect(DeleteAdministratorResponseSchema.typeName).toBe(
      "zitadel.internal_permission.v2.DeleteAdministratorResponse",
    )
    expect(InternalPermissionService.methods.find(({ localName }) => localName === "deleteAdministrator")?.name).toBe(
      "DeleteAdministrator",
    )
  })
})

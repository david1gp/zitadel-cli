import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  CreateAdministratorRequestSchema,
  CreateAdministratorResponseSchema,
  InternalPermissionService,
} from "../src/generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { internalPermissionCreateAdministratorRequestParse } from "../src/v2/internalPermissionCreateAdministratorRequestParse.js"
import { internalPermissionServiceCreateAdministrator } from "../src/v2/internalPermissionServiceCreateAdministrator.js"

describe("InternalPermissionService.CreateAdministrator", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await internalPermissionCreateAdministratorRequestParse({
      json: JSON.stringify({
        resource: { organizationId: "organization-1" },
        roles: ["ORG_OWNER"],
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
    expect(resource.value).toBe("organization-1")
    expect(result.data.roles).toEqual(["ORG_OWNER"])
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(CreateAdministratorResponseSchema, {
      creationDate: { nanos: 456000000, seconds: 123n },
    })

    const jsonResult = messageSerialize(CreateAdministratorResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ creationDate: "1970-01-01T00:02:03.456Z" })

    const yamlResult = messageSerialize(CreateAdministratorResponseSchema, response, "yaml")
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

    const result = await internalPermissionServiceCreateAdministrator({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "internalPermissionServiceCreateAdministrator",
      errorMessage: "request failed",
    })
  })

  test("returns the typed create response from the Connect client", async () => {
    const response = create(CreateAdministratorResponseSchema, {
      creationDate: { seconds: 123n },
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

    const result = await internalPermissionServiceCreateAdministrator({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        roles: ["ORG_OWNER"],
        userId: "user-1",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.creationDate?.seconds).toBe(123n)
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
    expect(CreateAdministratorRequestSchema.typeName).toBe("zitadel.internal_permission.v2.CreateAdministratorRequest")
    expect(CreateAdministratorResponseSchema.typeName).toBe(
      "zitadel.internal_permission.v2.CreateAdministratorResponse",
    )
    expect(InternalPermissionService.methods.find(({ localName }) => localName === "createAdministrator")?.name).toBe(
      "CreateAdministrator",
    )
  })
})

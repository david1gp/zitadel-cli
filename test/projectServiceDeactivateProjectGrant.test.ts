import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  DeactivateProjectGrantRequestSchema,
  DeactivateProjectGrantResponseSchema,
  ProjectService,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { projectDeactivateProjectGrantRequestParse } from "../src/v2/projectDeactivateProjectGrantRequestParse.js"
import { projectServiceDeactivateProjectGrant } from "../src/v2/projectServiceDeactivateProjectGrant.js"

describe("ProjectService.DeactivateProjectGrant", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await projectDeactivateProjectGrantRequestParse({
      json: JSON.stringify({
        grantedOrganizationId: "organization-1",
        projectId: "project-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.projectId).toBe("project-1")
    expect(result.data.grantedOrganizationId).toBe("organization-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(DeactivateProjectGrantResponseSchema, {
      changeDate: {
        nanos: 0,
        seconds: 1673746215n,
      },
    })

    const jsonResult = messageSerialize(DeactivateProjectGrantResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ changeDate: "2023-01-15T01:30:15Z" })

    const yamlResult = messageSerialize(DeactivateProjectGrantResponseSchema, response, "yaml")
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

    const result = await projectServiceDeactivateProjectGrant({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        grantedOrganizationId: "organization-1",
        projectId: "project-1",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceDeactivateProjectGrant",
      errorMessage: "request failed",
    })
  })

  test("returns the typed deactivate response from the Connect client", async () => {
    const response = create(DeactivateProjectGrantResponseSchema, {})
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async () => ({
        header: new Headers(),
        message: response,
        service: ProjectService,
        stream: false,
        trailer: new Headers(),
      }),
    } as unknown as Transport

    const result = await projectServiceDeactivateProjectGrant({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        grantedOrganizationId: "organization-1",
        projectId: "project-1",
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
    expect(DeactivateProjectGrantRequestSchema.typeName).toBe("zitadel.project.v2.DeactivateProjectGrantRequest")
    expect(DeactivateProjectGrantResponseSchema.typeName).toBe("zitadel.project.v2.DeactivateProjectGrantResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "deactivateProjectGrant")?.name).toBe(
      "DeactivateProjectGrant",
    )
  })
})

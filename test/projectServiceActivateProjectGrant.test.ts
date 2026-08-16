import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import {
  ActivateProjectGrantRequestSchema,
  ActivateProjectGrantResponseSchema,
  ProjectService,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { projectActivateProjectGrantRequestParse } from "../src/v2/projectActivateProjectGrantRequestParse.js"
import { projectServiceActivateProjectGrant } from "../src/v2/projectServiceActivateProjectGrant.js"

describe("ProjectService.ActivateProjectGrant", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await projectActivateProjectGrantRequestParse({
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

  test("returns transport failures as Result errors", async () => {
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async () => {
        throw new Error("request failed")
      },
    } as Transport

    const result = await projectServiceActivateProjectGrant({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceActivateProjectGrant",
      errorMessage: "request failed",
    })
  })

  test("returns the typed activate response from the Connect client", async () => {
    const response = create(ActivateProjectGrantResponseSchema)
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

    const result = await projectServiceActivateProjectGrant({
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
    expect(ActivateProjectGrantRequestSchema.typeName).toBe("zitadel.project.v2.ActivateProjectGrantRequest")
    expect(ActivateProjectGrantResponseSchema.typeName).toBe("zitadel.project.v2.ActivateProjectGrantResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "activateProjectGrant")?.name).toBe(
      "ActivateProjectGrant",
    )
  })
})

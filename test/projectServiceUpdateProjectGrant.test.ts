import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ProjectService,
  UpdateProjectGrantRequestSchema,
  UpdateProjectGrantResponseSchema,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { projectServiceUpdateProjectGrant } from "../src/v2/projectServiceUpdateProjectGrant.js"
import { projectUpdateProjectGrantRequestParse } from "../src/v2/projectUpdateProjectGrantRequestParse.js"

describe("ProjectService.UpdateProjectGrant", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await projectUpdateProjectGrantRequestParse({
      json: JSON.stringify({
        grantedOrganizationId: "organization-1",
        projectId: "project-1",
        roleKeys: ["project.read", "project.write"],
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.projectId).toBe("project-1")
    expect(result.data.grantedOrganizationId).toBe("organization-1")
    expect(result.data.roleKeys).toEqual(["project.read", "project.write"])
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(UpdateProjectGrantResponseSchema, {})

    const jsonResult = messageSerialize(UpdateProjectGrantResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(UpdateProjectGrantResponseSchema, response, "yaml")
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

    const result = await projectServiceUpdateProjectGrant({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        grantedOrganizationId: "organization-1",
        projectId: "project-1",
        roleKeys: ["project.read"],
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceUpdateProjectGrant",
      errorMessage: "request failed",
    })
  })

  test("returns the typed update response from the Connect client", async () => {
    const response = create(UpdateProjectGrantResponseSchema, {})
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

    const result = await projectServiceUpdateProjectGrant({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        grantedOrganizationId: "organization-1",
        projectId: "project-1",
        roleKeys: ["project.read"],
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.changeDate).toBeUndefined()
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
    expect(UpdateProjectGrantRequestSchema.typeName).toBe("zitadel.project.v2.UpdateProjectGrantRequest")
    expect(UpdateProjectGrantResponseSchema.typeName).toBe("zitadel.project.v2.UpdateProjectGrantResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "updateProjectGrant")?.name).toBe(
      "UpdateProjectGrant",
    )
  })
})

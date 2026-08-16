import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  AddProjectRoleRequestSchema,
  AddProjectRoleResponseSchema,
  ProjectService,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { projectAddProjectRoleRequestParse } from "../src/v2/projectAddProjectRoleRequestParse.js"
import { projectServiceAddProjectRole } from "../src/v2/projectServiceAddProjectRole.js"

describe("ProjectService.AddProjectRole", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await projectAddProjectRoleRequestParse({
      json: JSON.stringify({
        displayName: "Project administrator",
        group: "Administrators",
        projectId: "project-1",
        roleKey: "project.admin",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.projectId).toBe("project-1")
    expect(result.data.roleKey).toBe("project.admin")
    expect(result.data.displayName).toBe("Project administrator")
    expect(result.data.group).toBe("Administrators")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(AddProjectRoleResponseSchema, {})

    const jsonResult = messageSerialize(AddProjectRoleResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(AddProjectRoleResponseSchema, response, "yaml")
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

    const result = await projectServiceAddProjectRole({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceAddProjectRole",
      errorMessage: "request failed",
    })
  })

  test("returns the typed add-project-role response from the Connect client", async () => {
    const response = create(AddProjectRoleResponseSchema, {})
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

    const result = await projectServiceAddProjectRole({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        displayName: "Project administrator",
        projectId: "project-1",
        roleKey: "project.admin",
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
    expect(AddProjectRoleRequestSchema.typeName).toBe("zitadel.project.v2.AddProjectRoleRequest")
    expect(AddProjectRoleResponseSchema.typeName).toBe("zitadel.project.v2.AddProjectRoleResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "addProjectRole")?.name).toBe("AddProjectRole")
  })
})

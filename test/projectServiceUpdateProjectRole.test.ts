import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ProjectService,
  UpdateProjectRoleRequestSchema,
  UpdateProjectRoleResponseSchema,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { projectServiceUpdateProjectRole } from "../src/v2/projectServiceUpdateProjectRole.js"
import { projectUpdateProjectRoleRequestParse } from "../src/v2/projectUpdateProjectRoleRequestParse.js"

describe("ProjectService.UpdateProjectRole", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await projectUpdateProjectRoleRequestParse({
      json: JSON.stringify({
        displayName: "Administrator",
        group: "Access",
        projectId: "project-1",
        roleKey: "admin",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.projectId).toBe("project-1")
    expect(result.data.roleKey).toBe("admin")
    expect(result.data.displayName).toBe("Administrator")
    expect(result.data.group).toBe("Access")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(UpdateProjectRoleResponseSchema, {})

    const jsonResult = messageSerialize(UpdateProjectRoleResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(UpdateProjectRoleResponseSchema, response, "yaml")
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

    const result = await projectServiceUpdateProjectRole({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceUpdateProjectRole",
      errorMessage: "request failed",
    })
  })

  test("returns the typed update response from the Connect client", async () => {
    const response = create(UpdateProjectRoleResponseSchema, {})
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

    const result = await projectServiceUpdateProjectRole({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        displayName: "Administrator",
        group: "Access",
        projectId: "project-1",
        roleKey: "admin",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toBe(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(UpdateProjectRoleRequestSchema.typeName).toBe("zitadel.project.v2.UpdateProjectRoleRequest")
    expect(UpdateProjectRoleResponseSchema.typeName).toBe("zitadel.project.v2.UpdateProjectRoleResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "updateProjectRole")?.name).toBe(
      "UpdateProjectRole",
    )
  })
})

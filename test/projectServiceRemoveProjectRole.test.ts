import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import {
  ProjectService,
  RemoveProjectRoleRequestSchema,
  RemoveProjectRoleResponseSchema,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { projectRemoveProjectRoleRequestParse } from "../src/v2/projectRemoveProjectRoleRequestParse.js"
import { projectServiceRemoveProjectRole } from "../src/v2/projectServiceRemoveProjectRole.js"

describe("ProjectService.RemoveProjectRole", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await projectRemoveProjectRoleRequestParse({
      json: JSON.stringify({
        projectId: "project-1",
        roleKey: "reader",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.projectId).toBe("project-1")
    expect(result.data.roleKey).toBe("reader")
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

    const result = await projectServiceRemoveProjectRole({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        projectId: "project-1",
        roleKey: "reader",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceRemoveProjectRole",
      errorMessage: "request failed",
    })
  })

  test("returns the typed removal response from the Connect client", async () => {
    const response = create(RemoveProjectRoleResponseSchema, {})
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

    const result = await projectServiceRemoveProjectRole({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        projectId: "project-1",
        roleKey: "reader",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toEqual(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(RemoveProjectRoleRequestSchema.typeName).toBe("zitadel.project.v2.RemoveProjectRoleRequest")
    expect(RemoveProjectRoleResponseSchema.typeName).toBe("zitadel.project.v2.RemoveProjectRoleResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "removeProjectRole")?.name).toBe(
      "RemoveProjectRole",
    )
  })
})

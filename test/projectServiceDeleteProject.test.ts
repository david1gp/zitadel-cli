import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  DeleteProjectRequestSchema,
  DeleteProjectResponseSchema,
  ProjectService,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { projectDeleteProjectRequestParse } from "../src/v2/projectDeleteProjectRequestParse.js"
import { projectServiceDeleteProject } from "../src/v2/projectServiceDeleteProject.js"

describe("ProjectService.DeleteProject", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await projectDeleteProjectRequestParse({
      json: JSON.stringify({ projectId: "project-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.projectId).toBe("project-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(DeleteProjectResponseSchema, {})

    const jsonResult = messageSerialize(DeleteProjectResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(DeleteProjectResponseSchema, response, "yaml")
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

    const result = await projectServiceDeleteProject({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { projectId: "project-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceDeleteProject",
      errorMessage: "request failed",
    })
  })

  test("returns the typed delete response from the Connect client", async () => {
    const response = create(DeleteProjectResponseSchema, {})
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

    const result = await projectServiceDeleteProject({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { projectId: "project-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toEqual(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(DeleteProjectRequestSchema.typeName).toBe("zitadel.project.v2.DeleteProjectRequest")
    expect(DeleteProjectResponseSchema.typeName).toBe("zitadel.project.v2.DeleteProjectResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "deleteProject")?.name).toBe("DeleteProject")
  })
})

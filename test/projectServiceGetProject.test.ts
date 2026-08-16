import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  GetProjectRequestSchema,
  GetProjectResponseSchema,
  ProjectService,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { projectGetProjectRequestParse } from "../src/v2/projectGetProjectRequestParse.js"
import { projectServiceGetProject } from "../src/v2/projectServiceGetProject.js"

describe("ProjectService.GetProject", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await projectGetProjectRequestParse({
      json: JSON.stringify({ projectId: "project-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.projectId).toBe("project-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(GetProjectResponseSchema, {
      project: { name: "Example", projectId: "project-1" },
    })

    const jsonResult = messageSerialize(GetProjectResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      project: { name: "Example", projectId: "project-1" },
    })

    const yamlResult = messageSerialize(GetProjectResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      project: { name: "Example", projectId: "project-1" },
    })
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

    const result = await projectServiceGetProject({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceGetProject",
      errorMessage: "request failed",
    })
  })

  test("returns the typed get response from the Connect client", async () => {
    const response = create(GetProjectResponseSchema, {
      project: { name: "Example", projectId: "project-1" },
    })
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

    const result = await projectServiceGetProject({
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
    expect(result.data.project?.projectId).toBe("project-1")
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
    expect(GetProjectRequestSchema.typeName).toBe("zitadel.project.v2.GetProjectRequest")
    expect(GetProjectResponseSchema.typeName).toBe("zitadel.project.v2.GetProjectResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "getProject")?.name).toBe("GetProject")
  })
})

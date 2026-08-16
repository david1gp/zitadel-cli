import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { projectsActivateCommand } from "../src/cli/projectsActivateCommand.js"
import {
  ActivateProjectRequestSchema,
  ActivateProjectResponseSchema,
  ProjectService,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { projectActivateProjectRequestParse } from "../src/v2/projectActivateProjectRequestParse.js"
import { projectServiceActivateProject } from "../src/v2/projectServiceActivateProject.js"

describe("ProjectService.ActivateProject", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await projectActivateProjectRequestParse({
      json: JSON.stringify({ projectId: "project-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.projectId).toBe("project-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ActivateProjectResponseSchema, {})

    const jsonResult = messageSerialize(ActivateProjectResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(ActivateProjectResponseSchema, response, "yaml")
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

    const result = await projectServiceActivateProject({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { projectId: "project-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceActivateProject",
      errorMessage: "request failed",
    })
  })

  test("returns the typed activate response from the Connect client", async () => {
    const response = create(ActivateProjectResponseSchema, {})
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

    const result = await projectServiceActivateProject({
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

  test("adds the bearer token to Connect requests", async () => {
    const request = { header: new Headers() } as unknown as UnaryRequest
    const next = async (received: UnaryRequest | StreamRequest): Promise<UnaryResponse> => {
      expect(received.header.get("Authorization")).toBe("Bearer bearer-token")
      return {} as UnaryResponse
    }

    await zitadelBearerInterceptorCreate("bearer-token")(next)(request)
  })

  test("builds the CLI command", () => {
    expect(projectsActivateCommand).toBeDefined()
  })

  test("exposes the generated request and response descriptors", () => {
    expect(ActivateProjectRequestSchema.typeName).toBe("zitadel.project.v2.ActivateProjectRequest")
    expect(ActivateProjectResponseSchema.typeName).toBe("zitadel.project.v2.ActivateProjectResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "activateProject")?.name).toBe(
      "ActivateProject",
    )
  })
})

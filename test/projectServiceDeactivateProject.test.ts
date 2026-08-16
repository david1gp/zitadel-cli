import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  DeactivateProjectRequestSchema,
  DeactivateProjectResponseSchema,
  ProjectService,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { projectDeactivateProjectRequestParse } from "../src/v2/projectDeactivateProjectRequestParse.js"
import { projectServiceDeactivateProject } from "../src/v2/projectServiceDeactivateProject.js"

describe("ProjectService.DeactivateProject", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await projectDeactivateProjectRequestParse({
      json: JSON.stringify({ projectId: "project-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.projectId).toBe("project-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(DeactivateProjectResponseSchema, {})

    const jsonResult = messageSerialize(DeactivateProjectResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(DeactivateProjectResponseSchema, response, "yaml")
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

    const result = await projectServiceDeactivateProject({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { projectId: "project-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceDeactivateProject",
      errorMessage: "request failed",
    })
  })

  test("returns the typed deactivate response from the Connect client", async () => {
    const response = create(DeactivateProjectResponseSchema, {
      changeDate: { nanos: 0, seconds: 1n },
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

    const result = await projectServiceDeactivateProject({
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
    expect(result.data.changeDate?.seconds).toBe(1n)
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
    expect(DeactivateProjectRequestSchema.typeName).toBe("zitadel.project.v2.DeactivateProjectRequest")
    expect(DeactivateProjectResponseSchema.typeName).toBe("zitadel.project.v2.DeactivateProjectResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "deactivateProject")?.name).toBe(
      "DeactivateProject",
    )
  })
})

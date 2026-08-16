import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  CreateProjectRequestSchema,
  CreateProjectResponseSchema,
  ProjectService,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { projectCreateProjectRequestParse } from "../src/v2/projectCreateProjectRequestParse.js"
import { projectServiceCreateProject } from "../src/v2/projectServiceCreateProject.js"

describe("ProjectService.CreateProject", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await projectCreateProjectRequestParse({
      json: JSON.stringify({
        authorizationRequired: true,
        name: "Example",
        organizationId: "organization-1",
        privateLabelingSetting: "PRIVATE_LABELING_SETTING_ALLOW_LOGIN_USER_RESOURCE_OWNER_POLICY",
        projectAccessRequired: true,
        projectId: "project-1",
        projectRoleAssertion: true,
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.organizationId).toBe("organization-1")
    expect(result.data.projectId).toBe("project-1")
    expect(result.data.name).toBe("Example")
    expect(result.data.projectRoleAssertion).toBe(true)
    expect(result.data.authorizationRequired).toBe(true)
    expect(result.data.projectAccessRequired).toBe(true)
    expect(result.data.privateLabelingSetting).toBe(2)
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(CreateProjectResponseSchema, { projectId: "project-1" })

    const jsonResult = messageSerialize(CreateProjectResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ projectId: "project-1" })

    const yamlResult = messageSerialize(CreateProjectResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ projectId: "project-1" })
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

    const result = await projectServiceCreateProject({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceCreateProject",
      errorMessage: "request failed",
    })
  })

  test("returns the typed create response from the Connect client", async () => {
    const response = create(CreateProjectResponseSchema, { projectId: "project-1" })
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

    const result = await projectServiceCreateProject({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        name: "Example",
        organizationId: "organization-1",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.projectId).toBe("project-1")
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
    expect(CreateProjectRequestSchema.typeName).toBe("zitadel.project.v2.CreateProjectRequest")
    expect(CreateProjectResponseSchema.typeName).toBe("zitadel.project.v2.CreateProjectResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "createProject")?.name).toBe("CreateProject")
  })
})

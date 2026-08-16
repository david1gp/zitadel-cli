import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ProjectService,
  UpdateProjectRequestSchema,
  UpdateProjectResponseSchema,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { projectServiceUpdateProject } from "../src/v2/projectServiceUpdateProject.js"
import { projectUpdateProjectRequestParse } from "../src/v2/projectUpdateProjectRequestParse.js"

describe("ProjectService.UpdateProject", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await projectUpdateProjectRequestParse({
      json: JSON.stringify({
        authorizationRequired: true,
        name: "Example",
        privateLabelingSetting: "PRIVATE_LABELING_SETTING_ALLOW_LOGIN_USER_RESOURCE_OWNER_POLICY",
        projectAccessRequired: false,
        projectId: "project-1",
        projectRoleAssertion: false,
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.projectId).toBe("project-1")
    expect(result.data.name).toBe("Example")
    expect(result.data.projectRoleAssertion).toBe(false)
    expect(result.data.authorizationRequired).toBe(true)
    expect(result.data.projectAccessRequired).toBe(false)
    expect(result.data.privateLabelingSetting).toBe(2)
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(UpdateProjectResponseSchema, {})

    const jsonResult = messageSerialize(UpdateProjectResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(UpdateProjectResponseSchema, response, "yaml")
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

    const result = await projectServiceUpdateProject({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceUpdateProject",
      errorMessage: "request failed",
    })
  })

  test("returns the typed update response from the Connect client", async () => {
    const response = create(UpdateProjectResponseSchema, {})
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

    const result = await projectServiceUpdateProject({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        name: "Example",
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
    expect(UpdateProjectRequestSchema.typeName).toBe("zitadel.project.v2.UpdateProjectRequest")
    expect(UpdateProjectResponseSchema.typeName).toBe("zitadel.project.v2.UpdateProjectResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "updateProject")?.name).toBe("UpdateProject")
  })
})

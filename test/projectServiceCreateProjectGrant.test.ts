import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import {
  CreateProjectGrantRequestSchema,
  CreateProjectGrantResponseSchema,
  ProjectService,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { projectCreateProjectGrantRequestParse } from "../src/v2/projectCreateProjectGrantRequestParse.js"
import { projectServiceCreateProjectGrant } from "../src/v2/projectServiceCreateProjectGrant.js"

describe("ProjectService.CreateProjectGrant", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await projectCreateProjectGrantRequestParse({
      json: JSON.stringify({
        grantedOrganizationId: "organization-2",
        projectId: "project-1",
        roleKeys: ["PROJECT_OWNER"],
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.projectId).toBe("project-1")
    expect(result.data.grantedOrganizationId).toBe("organization-2")
    expect(result.data.roleKeys).toEqual(["PROJECT_OWNER"])
  })

  test("serializes the generated response", () => {
    const response = create(CreateProjectGrantResponseSchema, {})
    const result = messageSerialize(CreateProjectGrantResponseSchema, response, "json")

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(JSON.parse(result.data)).toEqual({})
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

    const result = await projectServiceCreateProjectGrant({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceCreateProjectGrant",
      errorMessage: "request failed",
    })
  })

  test("returns the typed create grant response from the Connect client", async () => {
    const response = create(CreateProjectGrantResponseSchema, {})
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

    const result = await projectServiceCreateProjectGrant({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        grantedOrganizationId: "organization-2",
        projectId: "project-1",
        roleKeys: ["PROJECT_OWNER"],
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toBe(response)
  })

  test("exposes the generated request, response, and method descriptors", () => {
    expect(CreateProjectGrantRequestSchema.typeName).toBe("zitadel.project.v2.CreateProjectGrantRequest")
    expect(CreateProjectGrantResponseSchema.typeName).toBe("zitadel.project.v2.CreateProjectGrantResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "createProjectGrant")?.name).toBe(
      "CreateProjectGrant",
    )
  })
})

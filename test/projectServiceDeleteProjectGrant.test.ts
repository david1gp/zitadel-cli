import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  DeleteProjectGrantRequestSchema,
  DeleteProjectGrantResponseSchema,
  ProjectService,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { projectDeleteProjectGrantRequestParse } from "../src/v2/projectDeleteProjectGrantRequestParse.js"
import { projectServiceDeleteProjectGrant } from "../src/v2/projectServiceDeleteProjectGrant.js"

describe("ProjectService.DeleteProjectGrant", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await projectDeleteProjectGrantRequestParse({
      json: JSON.stringify({
        grantedOrganizationId: "organization-1",
        projectId: "project-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.projectId).toBe("project-1")
    expect(result.data.grantedOrganizationId).toBe("organization-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(DeleteProjectGrantResponseSchema, {})

    const jsonResult = messageSerialize(DeleteProjectGrantResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(DeleteProjectGrantResponseSchema, response, "yaml")
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

    const result = await projectServiceDeleteProjectGrant({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        grantedOrganizationId: "organization-1",
        projectId: "project-1",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceDeleteProjectGrant",
      errorMessage: "request failed",
    })
  })

  test("returns the typed delete response from the Connect client", async () => {
    const response = create(DeleteProjectGrantResponseSchema)
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

    const result = await projectServiceDeleteProjectGrant({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        grantedOrganizationId: "organization-1",
        projectId: "project-1",
      },
      transport,
    })

    expect(result).toEqual({ success: true, data: response })
  })

  test("exposes the generated request and response descriptors", () => {
    expect(DeleteProjectGrantRequestSchema.typeName).toBe("zitadel.project.v2.DeleteProjectGrantRequest")
    expect(DeleteProjectGrantResponseSchema.typeName).toBe("zitadel.project.v2.DeleteProjectGrantResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "deleteProjectGrant")?.name).toBe(
      "DeleteProjectGrant",
    )
  })
})

import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ListProjectRolesRequestSchema,
  ListProjectRolesResponseSchema,
  ProjectService,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { projectListProjectRolesRequestParse } from "../src/v2/projectListProjectRolesRequestParse.js"
import { projectServiceListProjectRoles } from "../src/v2/projectServiceListProjectRoles.js"

describe("ProjectService.ListProjectRoles", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await projectListProjectRolesRequestParse({
      json: JSON.stringify({
        filters: [
          {
            roleKeyFilter: {
              key: "user.read",
              method: "TEXT_FILTER_METHOD_EQUALS",
            },
          },
        ],
        pagination: {
          asc: true,
          limit: 25,
          offset: "2",
        },
        projectId: "project-1",
        sortingColumn: "PROJECT_ROLE_FIELD_NAME_KEY",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.projectId).toBe("project-1")
    expect(result.data.pagination?.asc).toBe(true)
    expect(result.data.pagination?.limit).toBe(25)
    expect(result.data.pagination?.offset).toBe(2n)
    expect(result.data.sortingColumn).toBe(1)

    const filter = result.data.filters?.[0]
    expect(filter?.filter?.case).toBe("roleKeyFilter")
    if (filter?.filter === undefined || filter.filter.case !== "roleKeyFilter") {
      return
    }
    expect(filter.filter.value.key).toBe("user.read")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListProjectRolesResponseSchema, {
      projectRoles: [{ key: "user.read", projectId: "project-1" }],
    })

    const jsonResult = messageSerialize(ListProjectRolesResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      projectRoles: [{ key: "user.read", projectId: "project-1" }],
    })

    const yamlResult = messageSerialize(ListProjectRolesResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      projectRoles: [{ key: "user.read", projectId: "project-1" }],
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

    const result = await projectServiceListProjectRoles({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceListProjectRoles",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListProjectRolesResponseSchema, {
      projectRoles: [{ key: "user.read", projectId: "project-1" }],
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

    const result = await projectServiceListProjectRoles({
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
    expect(result.data.projectRoles[0]?.key).toBe("user.read")
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
    expect(ListProjectRolesRequestSchema.typeName).toBe("zitadel.project.v2.ListProjectRolesRequest")
    expect(ListProjectRolesResponseSchema.typeName).toBe("zitadel.project.v2.ListProjectRolesResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "listProjectRoles")?.name).toBe(
      "ListProjectRoles",
    )
  })
})

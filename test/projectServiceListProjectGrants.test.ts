import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ListProjectGrantsRequestSchema,
  ListProjectGrantsResponseSchema,
  ProjectService,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { projectListProjectGrantsRequestParse } from "../src/v2/projectListProjectGrantsRequestParse.js"
import { projectServiceListProjectGrants } from "../src/v2/projectServiceListProjectGrants.js"

describe("ProjectService.ListProjectGrants", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await projectListProjectGrantsRequestParse({
      json: JSON.stringify({
        filters: [
          {
            projectNameFilter: {
              method: "TEXT_FILTER_METHOD_EQUALS",
              projectName: "Example",
            },
          },
        ],
        pagination: {
          asc: true,
          limit: 25,
          offset: "2",
        },
        sortingColumn: "PROJECT_GRANT_FIELD_NAME_PROJECT_ID",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.pagination?.asc).toBe(true)
    expect(result.data.pagination?.limit).toBe(25)
    expect(result.data.pagination?.offset).toBe(2n)
    expect(result.data.sortingColumn).toBe(1)

    const filter = result.data.filters?.[0]
    expect(filter?.filter?.case).toBe("projectNameFilter")
    if (filter?.filter === undefined || filter.filter.case !== "projectNameFilter") {
      return
    }
    expect(filter.filter.value.projectName).toBe("Example")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListProjectGrantsResponseSchema, {
      projectGrants: [{ projectId: "project-1" }],
    })

    const jsonResult = messageSerialize(ListProjectGrantsResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      projectGrants: [{ projectId: "project-1" }],
    })

    const yamlResult = messageSerialize(ListProjectGrantsResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      projectGrants: [{ projectId: "project-1" }],
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

    const result = await projectServiceListProjectGrants({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceListProjectGrants",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListProjectGrantsResponseSchema, {
      projectGrants: [{ projectId: "project-1" }],
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

    const result = await projectServiceListProjectGrants({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { sortingColumn: 1 },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.projectGrants[0]?.projectId).toBe("project-1")
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
    expect(ListProjectGrantsRequestSchema.typeName).toBe("zitadel.project.v2.ListProjectGrantsRequest")
    expect(ListProjectGrantsResponseSchema.typeName).toBe("zitadel.project.v2.ListProjectGrantsResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "listProjectGrants")?.name).toBe(
      "ListProjectGrants",
    )
  })
})

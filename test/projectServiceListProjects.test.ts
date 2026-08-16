import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import type { StreamRequest, UnaryRequest, UnaryResponse, Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { zitadelConfigCreate } from "../src/config/index.js"
import {
  ListProjectsRequestSchema,
  ListProjectsResponseSchema,
  ProjectService,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { messageSerialize } from "../src/output/index.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { projectListProjectsRequestParse, projectServiceListProjects } from "../src/v2/index.js"

describe("ProjectService.ListProjects", () => {
  test("loads a selected env file with process and flag precedence", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-cli-"))
    const envFile = join(directory, ".env.test")

    try {
      await writeFile(
        envFile,
        ["ZITADEL_BASE_URL=https://from-file.example/", 'export ZITADEL_TOKEN="from-file"', ""].join("\n"),
      )

      const fileResult = await zitadelConfigCreate({ env: {}, envFile })
      expect(fileResult).toEqual({
        success: true,
        data: {
          baseUrl: "https://from-file.example",
          token: "from-file",
        },
      })

      const environmentResult = await zitadelConfigCreate({
        env: {
          ZITADEL_BASE_URL: "https://from-environment.example/",
          ZITADEL_TOKEN: "from-environment",
        },
        envFile,
      })
      expect(environmentResult).toEqual({
        success: true,
        data: {
          baseUrl: "https://from-environment.example",
          token: "from-environment",
        },
      })

      const flagResult = await zitadelConfigCreate({
        baseUrl: "https://from-flag.example/",
        env: {
          ZITADEL_BASE_URL: "https://from-environment.example/",
          ZITADEL_TOKEN: "from-environment",
        },
        envFile,
        token: "from-flag",
      })
      expect(flagResult).toEqual({
        success: true,
        data: {
          baseUrl: "https://from-flag.example",
          token: "from-flag",
        },
      })
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("parses the complete generated protobuf JSON request", async () => {
    const result = await projectListProjectsRequestParse({
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
        sortingColumn: "PROJECT_FIELD_NAME_NAME",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.pagination?.asc).toBe(true)
    expect(result.data.pagination?.limit).toBe(25)
    expect(result.data.pagination?.offset).toBe(2n)
    expect(result.data.sortingColumn).toBe(4)

    const filter = result.data.filters?.[0]
    expect(filter?.filter?.case).toBe("projectNameFilter")
    if (filter?.filter === undefined || filter.filter.case !== "projectNameFilter") {
      return
    }
    expect(filter.filter.value.projectName).toBe("Example")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListProjectsResponseSchema, {
      projects: [{ name: "Example", projectId: "project-1" }],
    })

    const jsonResult = messageSerialize(ListProjectsResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      projects: [{ name: "Example", projectId: "project-1" }],
    })

    const yamlResult = messageSerialize(ListProjectsResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      projects: [{ name: "Example", projectId: "project-1" }],
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

    const result = await projectServiceListProjects({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "projectServiceListProjects",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListProjectsResponseSchema, {
      projects: [{ name: "Example", projectId: "project-1" }],
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

    const result = await projectServiceListProjects({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { sortingColumn: 4 },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.projects[0]?.projectId).toBe("project-1")
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
    expect(ListProjectsRequestSchema.typeName).toBe("zitadel.project.v2.ListProjectsRequest")
    expect(ListProjectsResponseSchema.typeName).toBe("zitadel.project.v2.ListProjectsResponse")
    expect(ProjectService.methods.find(({ localName }) => localName === "listProjects")?.name).toBe("ListProjects")
  })
})

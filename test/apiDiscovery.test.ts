import { describe, expect, test } from "bun:test"
import { create, type DescMessage, type DescMethodUnary, type MessageInitShape } from "@bufbuild/protobuf"
import type { Transport, UnaryResponse } from "@connectrpc/connect"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { parse as yamlParse } from "yaml"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { apiCall, apiCatalogList, apiMetadataSerialize, apiMethodDescribe, apiMethodFind } from "../src/api/index.js"
import {
  ListProjectsResponseSchema,
  ProjectService,
  type ListProjectsResponse,
} from "../src/generated/zitadel/project/v2/project_service_pb.js"

describe("API discovery", () => {
  test("lists policy-filtered services and approved legacy methods", () => {
    const catalog = apiCatalogList()
    const project = catalog.services.find(({ serviceName }) => serviceName === "ProjectService")
    const legacy = catalog.services.find(({ apiVersion }) => apiVersion === "legacy_v1")

    expect(project?.methods.some(({ methodName }) => methodName === "ListProjects")).toBe(true)
    expect(project?.methods.some(({ methodName }) => methodName === "AddHumanUser")).toBe(false)
    expect(legacy?.methods.map(({ methodName }) => methodName)).toEqual(["ListIDPs", "AddGoogleProvider"])
    expect(catalog.deprecationPolicy.deprecatedMethods).toBe("excluded")
  })

  test("describes generated request and response fields without a hand-maintained schema", () => {
    const methodResult = apiMethodFind("ProjectService.ListProjects")
    expect(methodResult.success).toBe(true)
    if (!methodResult.success) {
      return
    }

    const description = apiMethodDescribe(methodResult.data)
    expect(description.request.typeName).toBe("zitadel.project.v2.ListProjectsRequest")
    expect(description.request.fields.map(({ jsonName }) => jsonName)).toEqual([
      "pagination",
      "sortingColumn",
      "filters",
    ])
    expect(description.response.typeName).toBe("zitadel.project.v2.ListProjectsResponse")
    expect(description.docs.url).toContain("ProjectService.ListProjects")
  })

  test("rejects excluded methods rather than invoking generated services directly", () => {
    expect(apiMethodFind("zitadel.user.v2.UserService.AddHumanUser").success).toBe(false)
    expect(apiMethodFind("zitadel.admin.v1.AdminService.Healthz").success).toBe(false)
  })

  test("serializes discovery metadata as JSON and YAML", () => {
    const value = apiCatalogList({ service: "ProjectService" })
    const json = apiMetadataSerialize(value, "json")
    const yaml = apiMetadataSerialize(value, "yaml")

    expect(json.success).toBe(true)
    expect(yaml.success).toBe(true)
    if (!json.success || !yaml.success) {
      return
    }
    expect(JSON.parse(json.data).services[0].serviceName).toBe("ProjectService")
    expect(yamlParse(yaml.data).services[0].serviceName).toBe("ProjectService")
  })

  test("calls a catalog method through shared endpoint configuration and transport", async () => {
    const response = create(ListProjectsResponseSchema, {
      projects: [{ name: "Example", projectId: "project-1" }],
    })
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async (
        method: DescMethodUnary,
        _signal: AbortSignal | undefined,
        _timeoutMs: number | undefined,
        _header: unknown,
        input: MessageInitShape<DescMessage>,
      ) => {
        expect(method.parent).toBe(ProjectService)
        expect(method.name).toBe("ListProjects")
        expect((input as { pagination?: { limit?: number } }).pagination?.limit).toBe(25)
        return {
          header: new Headers(),
          message: response,
          service: ProjectService,
          stream: false,
          trailer: new Headers(),
        } as unknown as UnaryResponse
      },
    } as unknown as Transport

    const result = await apiCall({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      method: "ProjectService.ListProjects",
      request: { pagination: { limit: 25 } },
      transport,
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect((result.data as unknown as ListProjectsResponse).projects[0]?.projectId).toBe("project-1")
    }

    const jsonResult = await apiCall({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      method: "ProjectService.ListProjects",
      requestJson: '{"pagination":{"limit":25}}',
      transport,
    })
    expect(jsonResult.success).toBe(true)

    const directory = await mkdtemp(join(tmpdir(), "zitadel-cli-api-"))
    try {
      const requestFile = join(directory, "request.json")
      await writeFile(requestFile, '{"pagination":{"limit":25}}')
      const fileResult = await apiCall({
        config: {
          baseUrl: "https://example.test",
          token: "token",
        },
        method: "ProjectService.ListProjects",
        requestFile,
        transport,
      })
      expect(fileResult.success).toBe(true)
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })
})

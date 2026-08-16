import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ApplicationService,
  ListApplicationsRequestSchema,
  ListApplicationsResponseSchema,
} from "../src/generated/zitadel/application/v2/application_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { applicationListApplicationsRequestParse } from "../src/v2/applicationListApplicationsRequestParse.js"
import { applicationServiceListApplications } from "../src/v2/applicationServiceListApplications.js"

describe("ApplicationService.ListApplications", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await applicationListApplicationsRequestParse({
      json: JSON.stringify({
        filters: [
          {
            nameFilter: {
              method: "TEXT_FILTER_METHOD_EQUALS",
              name: "Console",
            },
          },
        ],
        pagination: {
          asc: true,
          limit: 25,
          offset: "2",
        },
        sortingColumn: "APPLICATION_SORT_BY_NAME",
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
    expect(filter?.filter?.case).toBe("nameFilter")
    if (filter?.filter === undefined || filter.filter.case !== "nameFilter") {
      return
    }
    expect(filter.filter.value.name).toBe("Console")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListApplicationsResponseSchema, {
      applications: [{ applicationId: "application-1", name: "Console" }],
    })

    const jsonResult = messageSerialize(ListApplicationsResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      applications: [{ applicationId: "application-1", name: "Console" }],
    })

    const yamlResult = messageSerialize(ListApplicationsResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      applications: [{ applicationId: "application-1", name: "Console" }],
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

    const result = await applicationServiceListApplications({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "applicationServiceListApplications",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListApplicationsResponseSchema, {
      applications: [{ applicationId: "application-1", name: "Console" }],
    })
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async () => ({
        header: new Headers(),
        message: response,
        service: ApplicationService,
        stream: false,
        trailer: new Headers(),
      }),
    } as unknown as Transport

    const result = await applicationServiceListApplications({
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
    expect(result.data.applications[0]?.applicationId).toBe("application-1")
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
    expect(ListApplicationsRequestSchema.typeName).toBe("zitadel.application.v2.ListApplicationsRequest")
    expect(ListApplicationsResponseSchema.typeName).toBe("zitadel.application.v2.ListApplicationsResponse")
    expect(ApplicationService.methods.find(({ localName }) => localName === "listApplications")?.name).toBe(
      "ListApplications",
    )
  })
})

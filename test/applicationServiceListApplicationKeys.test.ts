import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ApplicationService,
  ListApplicationKeysRequestSchema,
  ListApplicationKeysResponseSchema,
} from "../src/generated/zitadel/application/v2/application_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { applicationListApplicationKeysRequestParse } from "../src/v2/applicationListApplicationKeysRequestParse.js"
import { applicationServiceListApplicationKeys } from "../src/v2/applicationServiceListApplicationKeys.js"

describe("ApplicationService.ListApplicationKeys", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await applicationListApplicationKeysRequestParse({
      json: JSON.stringify({
        filters: [
          {
            applicationIdFilter: {
              applicationId: "application-1",
            },
          },
        ],
        pagination: {
          asc: true,
          limit: 25,
          offset: "2",
        },
        sortingColumn: "APPLICATION_KEYS_SORT_BY_EXPIRATION",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.pagination?.asc).toBe(true)
    expect(result.data.pagination?.limit).toBe(25)
    expect(result.data.pagination?.offset).toBe(2n)
    expect(result.data.sortingColumn).toBe(5)

    const filter = result.data.filters?.[0]
    expect(filter?.filter?.case).toBe("applicationIdFilter")
    if (filter?.filter === undefined || filter.filter.case !== "applicationIdFilter") {
      return
    }
    expect(filter.filter.value.applicationId).toBe("application-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListApplicationKeysResponseSchema, {
      keys: [
        {
          applicationId: "application-1",
          keyId: "key-1",
          organizationId: "organization-1",
          projectId: "project-1",
        },
      ],
    })

    const jsonResult = messageSerialize(ListApplicationKeysResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      keys: [
        {
          applicationId: "application-1",
          keyId: "key-1",
          organizationId: "organization-1",
          projectId: "project-1",
        },
      ],
    })

    const yamlResult = messageSerialize(ListApplicationKeysResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      keys: [
        {
          applicationId: "application-1",
          keyId: "key-1",
          organizationId: "organization-1",
          projectId: "project-1",
        },
      ],
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

    const result = await applicationServiceListApplicationKeys({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "applicationServiceListApplicationKeys",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListApplicationKeysResponseSchema, {
      keys: [{ keyId: "key-1" }],
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

    const result = await applicationServiceListApplicationKeys({
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
    expect(result.data.keys[0]?.keyId).toBe("key-1")
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
    expect(ListApplicationKeysRequestSchema.typeName).toBe("zitadel.application.v2.ListApplicationKeysRequest")
    expect(ListApplicationKeysResponseSchema.typeName).toBe("zitadel.application.v2.ListApplicationKeysResponse")
    expect(ApplicationService.methods.find(({ localName }) => localName === "listApplicationKeys")?.name).toBe(
      "ListApplicationKeys",
    )
  })
})

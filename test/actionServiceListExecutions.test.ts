import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ActionService,
  ListExecutionsRequestSchema,
  ListExecutionsResponseSchema,
} from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { actionListExecutionsRequestParse } from "../src/v2/actionListExecutionsRequestParse.js"
import { actionServiceListExecutions } from "../src/v2/actionServiceListExecutions.js"

describe("ActionService.ListExecutions", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await actionListExecutionsRequestParse({
      json: JSON.stringify({
        filters: [
          {
            executionTypeFilter: {
              executionType: "EXECUTION_TYPE_REQUEST",
            },
          },
          {
            targetFilter: {
              targetId: "target-1",
            },
          },
        ],
        pagination: {
          asc: true,
          limit: 25,
          offset: "2",
        },
        sortingColumn: "EXECUTION_FIELD_NAME_CHANGED_DATE",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.pagination?.asc).toBe(true)
    expect(result.data.pagination?.limit).toBe(25)
    expect(result.data.pagination?.offset).toBe(2n)
    expect(result.data.sortingColumn).toBe(3)

    const typeFilter = result.data.filters?.[0]
    expect(typeFilter?.filter?.case).toBe("executionTypeFilter")
    if (typeFilter?.filter === undefined || typeFilter.filter.case !== "executionTypeFilter") {
      return
    }
    expect(typeFilter.filter.value.executionType).toBe(1)

    const targetFilter = result.data.filters?.[1]
    expect(targetFilter?.filter?.case).toBe("targetFilter")
    if (targetFilter?.filter === undefined || targetFilter.filter.case !== "targetFilter") {
      return
    }
    expect(targetFilter.filter.value.targetId).toBe("target-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListExecutionsResponseSchema, {
      executions: [{ targets: ["target-1", "target-2"] }],
    })

    const jsonResult = messageSerialize(ListExecutionsResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      executions: [{ targets: ["target-1", "target-2"] }],
    })

    const yamlResult = messageSerialize(ListExecutionsResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      executions: [{ targets: ["target-1", "target-2"] }],
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

    const result = await actionServiceListExecutions({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "actionServiceListExecutions",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListExecutionsResponseSchema, {
      executions: [{ targets: ["target-1"] }],
    })
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async () => ({
        header: new Headers(),
        message: response,
        service: ActionService,
        stream: false,
        trailer: new Headers(),
      }),
    } as unknown as Transport

    const result = await actionServiceListExecutions({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { sortingColumn: 3 },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.executions[0]?.targets).toEqual(["target-1"])
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
    expect(ListExecutionsRequestSchema.typeName).toBe("zitadel.action.v2.ListExecutionsRequest")
    expect(ListExecutionsResponseSchema.typeName).toBe("zitadel.action.v2.ListExecutionsResponse")
    expect(ActionService.methods.find(({ localName }) => localName === "listExecutions")?.name).toBe("ListExecutions")
  })
})

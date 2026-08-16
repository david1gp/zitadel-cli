import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ActionService,
  ListTargetsRequestSchema,
  ListTargetsResponseSchema,
} from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { actionListTargetsRequestParse } from "../src/v2/actionListTargetsRequestParse.js"
import { actionServiceListTargets } from "../src/v2/actionServiceListTargets.js"

describe("ActionService.ListTargets", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await actionListTargetsRequestParse({
      json: JSON.stringify({
        filters: [
          {
            targetNameFilter: {
              method: "TEXT_FILTER_METHOD_EQUALS",
              targetName: "Example",
            },
          },
          {
            inTargetIdsFilter: {
              targetIds: ["target-1"],
            },
          },
        ],
        pagination: {
          asc: true,
          limit: 25,
          offset: "2",
        },
        sortingColumn: "TARGET_FIELD_NAME_NAME",
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

    const nameFilter = result.data.filters?.[0]
    expect(nameFilter?.filter?.case).toBe("targetNameFilter")
    if (nameFilter?.filter === undefined || nameFilter.filter.case !== "targetNameFilter") {
      return
    }
    expect(nameFilter.filter.value.targetName).toBe("Example")

    const idsFilter = result.data.filters?.[1]
    expect(idsFilter?.filter?.case).toBe("inTargetIdsFilter")
    if (idsFilter?.filter === undefined || idsFilter.filter.case !== "inTargetIdsFilter") {
      return
    }
    expect(idsFilter.filter.value.targetIds).toEqual(["target-1"])
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListTargetsResponseSchema, {
      targets: [{ id: "target-1", name: "Example", endpoint: "https://example.test/action" }],
    })

    const jsonResult = messageSerialize(ListTargetsResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      targets: [{ id: "target-1", name: "Example", endpoint: "https://example.test/action" }],
    })

    const yamlResult = messageSerialize(ListTargetsResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      targets: [{ id: "target-1", name: "Example", endpoint: "https://example.test/action" }],
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

    const result = await actionServiceListTargets({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "actionServiceListTargets",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListTargetsResponseSchema, {
      targets: [{ id: "target-1", name: "Example", endpoint: "https://example.test/action" }],
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

    const result = await actionServiceListTargets({
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
    expect(result.data.targets[0]?.id).toBe("target-1")
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
    expect(ListTargetsRequestSchema.typeName).toBe("zitadel.action.v2.ListTargetsRequest")
    expect(ListTargetsResponseSchema.typeName).toBe("zitadel.action.v2.ListTargetsResponse")
    expect(ActionService.methods.find(({ localName }) => localName === "listTargets")?.name).toBe("ListTargets")
  })
})

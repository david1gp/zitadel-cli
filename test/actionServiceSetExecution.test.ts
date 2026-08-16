import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { actionsExecutionsSetCommand } from "../src/cli/actionsExecutionsSetCommand.js"
import {
  ActionService,
  SetExecutionRequestSchema,
  SetExecutionResponseSchema,
} from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { actionServiceSetExecution } from "../src/v2/actionServiceSetExecution.js"
import { actionSetExecutionRequestParse } from "../src/v2/actionSetExecutionRequestParse.js"

describe("ActionService.SetExecution", () => {
  test("parses the generated protobuf JSON request with a condition and targets", async () => {
    const result = await actionSetExecutionRequestParse({
      json: JSON.stringify({
        condition: {
          request: {
            method: "zitadel.user.v2.UserService.GetUserByID",
          },
        },
        targets: ["target-1", "target-2"],
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    const conditionType = result.data.condition?.conditionType
    expect(conditionType?.case).toBe("request")
    if (conditionType?.case !== "request") {
      return
    }

    const condition = conditionType.value.condition
    expect(condition?.case).toBe("method")
    if (condition?.case !== "method") {
      return
    }

    expect(condition.value).toBe("zitadel.user.v2.UserService.GetUserByID")
    expect(result.data.targets).toEqual(["target-1", "target-2"])
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(SetExecutionResponseSchema, {})

    const jsonResult = messageSerialize(SetExecutionResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(SetExecutionResponseSchema, response, "yaml")
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

    const result = await actionServiceSetExecution({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { targets: ["target-1"] },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "actionServiceSetExecution",
      errorMessage: "request failed",
    })
  })

  test("returns the typed set execution response from the Connect client", async () => {
    const response = create(SetExecutionResponseSchema, {})
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

    const result = await actionServiceSetExecution({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { targets: ["target-1"] },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toBe(response)
  })

  test("adds the bearer token to Connect requests", async () => {
    const request = { header: new Headers() } as unknown as UnaryRequest
    const next = async (received: UnaryRequest | StreamRequest): Promise<UnaryResponse> => {
      expect(received.header.get("Authorization")).toBe("Bearer bearer-token")
      return {} as UnaryResponse
    }

    await zitadelBearerInterceptorCreate("bearer-token")(next)(request)
  })

  test("exposes the generated request and response descriptors and command", () => {
    expect(SetExecutionRequestSchema.typeName).toBe("zitadel.action.v2.SetExecutionRequest")
    expect(SetExecutionResponseSchema.typeName).toBe("zitadel.action.v2.SetExecutionResponse")
    expect(ActionService.methods.find(({ localName }) => localName === "setExecution")?.name).toBe("SetExecution")
    expect(actionsExecutionsSetCommand).toBeDefined()
  })
})

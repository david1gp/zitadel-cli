import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ActionService,
  ListExecutionFunctionsRequestSchema,
  ListExecutionFunctionsResponseSchema,
} from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { actionListExecutionFunctionsRequestParse } from "../src/v2/actionListExecutionFunctionsRequestParse.js"
import { actionServiceListExecutionFunctions } from "../src/v2/actionServiceListExecutionFunctions.js"

describe("ActionService.ListExecutionFunctions", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await actionListExecutionFunctionsRequestParse({
      json: "{}",
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data).toEqual({
      $typeName: "zitadel.action.v2.ListExecutionFunctionsRequest",
    })
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListExecutionFunctionsResponseSchema, {
      functions: ["execution.created", "user.human.added"],
    })

    const jsonResult = messageSerialize(ListExecutionFunctionsResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      functions: ["execution.created", "user.human.added"],
    })

    const yamlResult = messageSerialize(ListExecutionFunctionsResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      functions: ["execution.created", "user.human.added"],
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

    const result = await actionServiceListExecutionFunctions({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "actionServiceListExecutionFunctions",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListExecutionFunctionsResponseSchema, {
      functions: ["execution.created"],
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

    const result = await actionServiceListExecutionFunctions({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.functions).toEqual(["execution.created"])
  })

  test("exposes the generated request and response descriptors", () => {
    expect(ListExecutionFunctionsRequestSchema.typeName).toBe("zitadel.action.v2.ListExecutionFunctionsRequest")
    expect(ListExecutionFunctionsResponseSchema.typeName).toBe("zitadel.action.v2.ListExecutionFunctionsResponse")
    expect(ActionService.methods.find(({ localName }) => localName === "listExecutionFunctions")?.name).toBe(
      "ListExecutionFunctions",
    )
  })
})

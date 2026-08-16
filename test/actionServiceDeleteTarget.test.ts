import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ActionService,
  DeleteTargetRequestSchema,
  DeleteTargetResponseSchema,
} from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { actionDeleteTargetRequestParse } from "../src/v2/actionDeleteTargetRequestParse.js"
import { actionServiceDeleteTarget } from "../src/v2/actionServiceDeleteTarget.js"

describe("ActionService.DeleteTarget", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await actionDeleteTargetRequestParse({
      json: JSON.stringify({ id: "target-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.id).toBe("target-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(DeleteTargetResponseSchema, {
      deletionDate: { nanos: 0, seconds: 1735689600n },
    })

    const jsonResult = messageSerialize(DeleteTargetResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ deletionDate: "2025-01-01T00:00:00Z" })

    const yamlResult = messageSerialize(DeleteTargetResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ deletionDate: "2025-01-01T00:00:00Z" })
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

    const result = await actionServiceDeleteTarget({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { id: "target-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "actionServiceDeleteTarget",
      errorMessage: "request failed",
    })
  })

  test("returns the typed delete response from the Connect client", async () => {
    const response = create(DeleteTargetResponseSchema, {
      deletionDate: { nanos: 0, seconds: 1735689600n },
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

    const result = await actionServiceDeleteTarget({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { id: "target-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toEqual(response)
    expect(result.data.deletionDate?.seconds).toBe(1735689600n)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(DeleteTargetRequestSchema.typeName).toBe("zitadel.action.v2.DeleteTargetRequest")
    expect(DeleteTargetResponseSchema.typeName).toBe("zitadel.action.v2.DeleteTargetResponse")
    expect(ActionService.methods.find(({ localName }) => localName === "deleteTarget")?.name).toBe("DeleteTarget")
  })
})

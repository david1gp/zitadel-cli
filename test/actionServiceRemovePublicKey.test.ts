import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { actionsRemovePublicKeyCommand } from "../src/cli/actionsRemovePublicKeyCommand.js"
import {
  ActionService,
  RemovePublicKeyRequestSchema,
  RemovePublicKeyResponseSchema,
} from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { actionRemovePublicKeyRequestParse } from "../src/v2/actionRemovePublicKeyRequestParse.js"
import { actionServiceRemovePublicKey } from "../src/v2/actionServiceRemovePublicKey.js"

describe("ActionService.RemovePublicKey", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await actionRemovePublicKeyRequestParse({
      json: JSON.stringify({
        keyId: "key-1",
        targetId: "target-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.targetId).toBe("target-1")
    expect(result.data.keyId).toBe("key-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(RemovePublicKeyResponseSchema, {})

    const jsonResult = messageSerialize(RemovePublicKeyResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(RemovePublicKeyResponseSchema, response, "yaml")
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

    const result = await actionServiceRemovePublicKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        keyId: "key-1",
        targetId: "target-1",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "actionServiceRemovePublicKey",
      errorMessage: "request failed",
    })
  })

  test("returns the typed removal response from the Connect client", async () => {
    const response = create(RemovePublicKeyResponseSchema, {})
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

    const result = await actionServiceRemovePublicKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        keyId: "key-1",
        targetId: "target-1",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toBe(response)
  })

  test("exposes the generated request and response descriptors and command", () => {
    expect(RemovePublicKeyRequestSchema.typeName).toBe("zitadel.action.v2.RemovePublicKeyRequest")
    expect(RemovePublicKeyResponseSchema.typeName).toBe("zitadel.action.v2.RemovePublicKeyResponse")
    expect(ActionService.methods.find(({ localName }) => localName === "removePublicKey")?.name).toBe("RemovePublicKey")
    expect(actionsRemovePublicKeyCommand).toBeDefined()
  })
})

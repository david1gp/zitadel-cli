import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { actionsTargetsActivatePublicKeyCommand } from "../src/cli/actionsTargetsActivatePublicKeyCommand.js"
import {
  ActionService,
  ActivatePublicKeyRequestSchema,
  ActivatePublicKeyResponseSchema,
} from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { actionActivatePublicKeyRequestParse } from "../src/v2/actionActivatePublicKeyRequestParse.js"
import { actionServiceActivatePublicKey } from "../src/v2/actionServiceActivatePublicKey.js"

describe("ActionService.ActivatePublicKey", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await actionActivatePublicKeyRequestParse({
      json: JSON.stringify({ targetId: "target-1", keyId: "key-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.targetId).toBe("target-1")
    expect(result.data.keyId).toBe("key-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ActivatePublicKeyResponseSchema, {})

    const jsonResult = messageSerialize(ActivatePublicKeyResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(ActivatePublicKeyResponseSchema, response, "yaml")
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

    const result = await actionServiceActivatePublicKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { targetId: "target-1", keyId: "key-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "actionServiceActivatePublicKey",
      errorMessage: "request failed",
    })
  })

  test("returns the typed activate response from the Connect client", async () => {
    const response = create(ActivatePublicKeyResponseSchema, {})
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

    const result = await actionServiceActivatePublicKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { targetId: "target-1", keyId: "key-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toEqual(response)
  })

  test("adds the bearer token to Connect requests", async () => {
    const request = { header: new Headers() } as unknown as UnaryRequest
    const next = async (received: UnaryRequest | StreamRequest): Promise<UnaryResponse> => {
      expect(received.header.get("Authorization")).toBe("Bearer bearer-token")
      return {} as UnaryResponse
    }

    await zitadelBearerInterceptorCreate("bearer-token")(next)(request)
  })

  test("builds the CLI command", () => {
    expect(actionsTargetsActivatePublicKeyCommand).toBeDefined()
  })

  test("exposes the generated request and response descriptors", () => {
    expect(ActivatePublicKeyRequestSchema.typeName).toBe("zitadel.action.v2.ActivatePublicKeyRequest")
    expect(ActivatePublicKeyResponseSchema.typeName).toBe("zitadel.action.v2.ActivatePublicKeyResponse")
    expect(ActionService.methods.find(({ localName }) => localName === "activatePublicKey")?.name).toBe(
      "ActivatePublicKey",
    )
  })
})

import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { actionsTargetsAddPublicKeyCommand } from "../src/cli/actionsTargetsAddPublicKeyCommand.js"
import {
  ActionService,
  AddPublicKeyRequestSchema,
  AddPublicKeyResponseSchema,
} from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { actionAddPublicKeyRequestParse } from "../src/v2/actionAddPublicKeyRequestParse.js"
import { actionServiceAddPublicKey } from "../src/v2/actionServiceAddPublicKey.js"

describe("ActionService.AddPublicKey", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await actionAddPublicKeyRequestParse({
      json: JSON.stringify({
        expirationDate: "2030-01-01T00:00:00Z",
        publicKey: "AQI=",
        targetId: "target-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.targetId).toBe("target-1")
    expect(result.data.publicKey).toEqual(new Uint8Array([1, 2]))
    expect(result.data.expirationDate?.seconds).toBe(1893456000n)
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(AddPublicKeyResponseSchema, {
      creationDate: { nanos: 0, seconds: 1893456000n },
      keyId: "key-1",
    })

    const jsonResult = messageSerialize(AddPublicKeyResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      creationDate: "2030-01-01T00:00:00Z",
      keyId: "key-1",
    })

    const yamlResult = messageSerialize(AddPublicKeyResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      creationDate: "2030-01-01T00:00:00Z",
      keyId: "key-1",
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

    const result = await actionServiceAddPublicKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { publicKey: new Uint8Array([1]), targetId: "target-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "actionServiceAddPublicKey",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(AddPublicKeyResponseSchema, { keyId: "key-1" })
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

    const result = await actionServiceAddPublicKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { publicKey: new Uint8Array([1]), targetId: "target-1" },
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

  test("builds the CLI command", () => {
    expect(actionsTargetsAddPublicKeyCommand).toBeDefined()
  })

  test("exposes the generated request and response descriptors", () => {
    expect(AddPublicKeyRequestSchema.typeName).toBe("zitadel.action.v2.AddPublicKeyRequest")
    expect(AddPublicKeyResponseSchema.typeName).toBe("zitadel.action.v2.AddPublicKeyResponse")
    expect(ActionService.methods.find(({ localName }) => localName === "addPublicKey")?.name).toBe("AddPublicKey")
  })
})

import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ApplicationService,
  GetApplicationKeyRequestSchema,
  GetApplicationKeyResponseSchema,
} from "../src/generated/zitadel/application/v2/application_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { applicationGetApplicationKeyRequestParse } from "../src/v2/applicationGetApplicationKeyRequestParse.js"
import { applicationServiceGetApplicationKey } from "../src/v2/applicationServiceGetApplicationKey.js"

describe("ApplicationService.GetApplicationKey", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await applicationGetApplicationKeyRequestParse({
      json: JSON.stringify({ keyId: "key-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.keyId).toBe("key-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(GetApplicationKeyResponseSchema, {
      keyId: "key-1",
    })

    const jsonResult = messageSerialize(GetApplicationKeyResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ keyId: "key-1" })

    const yamlResult = messageSerialize(GetApplicationKeyResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ keyId: "key-1" })
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

    const result = await applicationServiceGetApplicationKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "applicationServiceGetApplicationKey",
      errorMessage: "request failed",
    })
  })

  test("returns the typed application key response from the Connect client", async () => {
    const response = create(GetApplicationKeyResponseSchema, {
      keyId: "key-1",
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

    const result = await applicationServiceGetApplicationKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { keyId: "key-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.keyId).toBe("key-1")
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
    expect(GetApplicationKeyRequestSchema.typeName).toBe("zitadel.application.v2.GetApplicationKeyRequest")
    expect(GetApplicationKeyResponseSchema.typeName).toBe("zitadel.application.v2.GetApplicationKeyResponse")
    expect(ApplicationService.methods.find(({ localName }) => localName === "getApplicationKey")?.name).toBe(
      "GetApplicationKey",
    )
  })
})

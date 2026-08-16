import { describe, expect, test } from "bun:test"
import type { Transport } from "@connectrpc/connect"
import { create } from "@bufbuild/protobuf"
import { parse as yamlParse } from "yaml"
import { AddGoogleProviderRequestSchema, AddGoogleProviderResponseSchema } from "../src/generated/zitadel/admin_pb.js"
import { adminAddGoogleProviderCommand } from "../src/cli/adminAddGoogleProviderCommand.js"
import {
  adminAddGoogleProviderRequestParse,
  adminServiceAddGoogleProvider,
} from "../src/legacy_v1/addGoogleProvider.js"
import { messageSerialize } from "../src/output/messageSerialize.js"

describe("AdminService.AddGoogleProvider", () => {
  test("parses every generated protobuf JSON request field", async () => {
    const result = await adminAddGoogleProviderRequestParse({
      json: JSON.stringify({
        name: "Google",
        clientId: "client-id",
        clientSecret: "client-secret",
        scopes: ["openid", "email", "profile"],
        providerOptions: {
          isLinkingAllowed: true,
          isCreationAllowed: true,
          isAutoCreation: false,
          isAutoUpdate: true,
          autoLinking: "AUTO_LINKING_OPTION_EMAIL",
        },
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data).toMatchObject({
      name: "Google",
      clientId: "client-id",
      clientSecret: "client-secret",
      scopes: ["openid", "email", "profile"],
      providerOptions: {
        isLinkingAllowed: true,
        isCreationAllowed: true,
        isAutoCreation: false,
        isAutoUpdate: true,
        autoLinking: 2,
      },
    })
  })

  test("invokes only the isolated legacy AdminService method and returns its response", async () => {
    const response = create(AddGoogleProviderResponseSchema, { id: "provider-1" })
    let receivedMethod = ""
    let receivedRequest: unknown
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async (
        method: { readonly name: string },
        _signal: AbortSignal | undefined,
        _timeoutMs: number | undefined,
        _header: unknown,
        input: unknown,
      ) => {
        receivedMethod = method.name
        receivedRequest = input
        return {
          header: new Headers(),
          message: response,
          service: undefined,
          stream: false,
          trailer: new Headers(),
        }
      },
    } as unknown as Transport

    const result = await adminServiceAddGoogleProvider({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        name: "Google",
        clientId: "client-id",
        clientSecret: "client-secret",
        scopes: ["openid"],
      },
      transport,
    })

    expect(result.success).toBe(true)
    expect(receivedMethod).toBe("AddGoogleProvider")
    expect(receivedRequest).toMatchObject({
      name: "Google",
      clientId: "client-id",
      clientSecret: "client-secret",
      scopes: ["openid"],
    })
  })

  test("converts transport failures to Result errors", async () => {
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async () => {
        throw new Error("request failed")
      },
    } as Transport

    const result = await adminServiceAddGoogleProvider({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "adminServiceAddGoogleProvider",
      errorMessage: "request failed",
    })
  })

  test("serializes the generated response as JSON and YAML", () => {
    const response = create(AddGoogleProviderResponseSchema, { id: "provider-1" })

    const jsonResult = messageSerialize(AddGoogleProviderResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ id: "provider-1" })

    const yamlResult = messageSerialize(AddGoogleProviderResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ id: "provider-1" })
  })

  test("provides a standalone Stricli command", () => {
    expect(adminAddGoogleProviderCommand).toBeDefined()
    expect(AddGoogleProviderRequestSchema.typeName).toBe("zitadel.admin.v1.AddGoogleProviderRequest")
    expect(AddGoogleProviderResponseSchema.typeName).toBe("zitadel.admin.v1.AddGoogleProviderResponse")
  })
})

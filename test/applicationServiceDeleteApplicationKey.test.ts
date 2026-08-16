import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ApplicationService,
  DeleteApplicationKeyRequestSchema,
  DeleteApplicationKeyResponseSchema,
} from "../src/generated/zitadel/application/v2/application_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { applicationDeleteApplicationKeyRequestParse } from "../src/v2/applicationDeleteApplicationKeyRequestParse.js"
import { applicationServiceDeleteApplicationKey } from "../src/v2/applicationServiceDeleteApplicationKey.js"

describe("ApplicationService.DeleteApplicationKey", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await applicationDeleteApplicationKeyRequestParse({
      json: JSON.stringify({
        applicationId: "application-1",
        keyId: "key-1",
        projectId: "project-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.keyId).toBe("key-1")
    expect(result.data.applicationId).toBe("application-1")
    expect(result.data.projectId).toBe("project-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(DeleteApplicationKeyResponseSchema, {})

    const jsonResult = messageSerialize(DeleteApplicationKeyResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(DeleteApplicationKeyResponseSchema, response, "yaml")
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

    const result = await applicationServiceDeleteApplicationKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        applicationId: "application-1",
        keyId: "key-1",
        projectId: "project-1",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "applicationServiceDeleteApplicationKey",
      errorMessage: "request failed",
    })
  })

  test("returns the typed delete response from the Connect client", async () => {
    const response = create(DeleteApplicationKeyResponseSchema, {})
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

    const result = await applicationServiceDeleteApplicationKey({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        applicationId: "application-1",
        keyId: "key-1",
        projectId: "project-1",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toEqual(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(DeleteApplicationKeyRequestSchema.typeName).toBe("zitadel.application.v2.DeleteApplicationKeyRequest")
    expect(DeleteApplicationKeyResponseSchema.typeName).toBe("zitadel.application.v2.DeleteApplicationKeyResponse")
    expect(ApplicationService.methods.find(({ localName }) => localName === "deleteApplicationKey")?.name).toBe(
      "DeleteApplicationKey",
    )
  })
})

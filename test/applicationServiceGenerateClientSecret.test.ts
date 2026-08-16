import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import {
  ApplicationService,
  GenerateClientSecretRequestSchema,
  GenerateClientSecretResponseSchema,
} from "../src/generated/zitadel/application/v2/application_service_pb.js"
import { applicationGenerateClientSecretRequestParse } from "../src/v2/applicationGenerateClientSecretRequestParse.js"
import { applicationServiceGenerateClientSecret } from "../src/v2/applicationServiceGenerateClientSecret.js"

describe("ApplicationService.GenerateClientSecret", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await applicationGenerateClientSecretRequestParse({
      json: JSON.stringify({
        applicationId: "application-1",
        projectId: "project-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.applicationId).toBe("application-1")
    expect(result.data.projectId).toBe("project-1")
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

    const result = await applicationServiceGenerateClientSecret({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "applicationServiceGenerateClientSecret",
      errorMessage: "request failed",
    })
  })

  test("returns the typed generated response from the Connect client", async () => {
    const response = create(GenerateClientSecretResponseSchema, {
      clientSecret: "client-secret",
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

    const result = await applicationServiceGenerateClientSecret({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        applicationId: "application-1",
        projectId: "project-1",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.clientSecret).toBe("client-secret")
  })

  test("exposes the generated request and response descriptors", () => {
    expect(GenerateClientSecretRequestSchema.typeName).toBe("zitadel.application.v2.GenerateClientSecretRequest")
    expect(GenerateClientSecretResponseSchema.typeName).toBe("zitadel.application.v2.GenerateClientSecretResponse")
    expect(ApplicationService.methods.find(({ localName }) => localName === "generateClientSecret")?.name).toBe(
      "GenerateClientSecret",
    )
  })
})

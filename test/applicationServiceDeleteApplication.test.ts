import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ApplicationService,
  DeleteApplicationRequestSchema,
  DeleteApplicationResponseSchema,
} from "../src/generated/zitadel/application/v2/application_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { applicationDeleteApplicationRequestParse } from "../src/v2/applicationDeleteApplicationRequestParse.js"
import { applicationServiceDeleteApplication } from "../src/v2/applicationServiceDeleteApplication.js"

describe("ApplicationService.DeleteApplication", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await applicationDeleteApplicationRequestParse({
      json: JSON.stringify({ applicationId: "application-1", projectId: "project-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.applicationId).toBe("application-1")
    expect(result.data.projectId).toBe("project-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(DeleteApplicationResponseSchema, {})

    const jsonResult = messageSerialize(DeleteApplicationResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(DeleteApplicationResponseSchema, response, "yaml")
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

    const result = await applicationServiceDeleteApplication({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { applicationId: "application-1", projectId: "project-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "applicationServiceDeleteApplication",
      errorMessage: "request failed",
    })
  })

  test("returns the typed delete response from the Connect client", async () => {
    const response = create(DeleteApplicationResponseSchema, {})
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

    const result = await applicationServiceDeleteApplication({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { applicationId: "application-1", projectId: "project-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data).toEqual(response)
  })

  test("exposes the generated request and response descriptors", () => {
    expect(DeleteApplicationRequestSchema.typeName).toBe("zitadel.application.v2.DeleteApplicationRequest")
    expect(DeleteApplicationResponseSchema.typeName).toBe("zitadel.application.v2.DeleteApplicationResponse")
    expect(ApplicationService.methods.find(({ localName }) => localName === "deleteApplication")?.name).toBe(
      "DeleteApplication",
    )
  })
})

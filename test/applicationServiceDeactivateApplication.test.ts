import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ApplicationService,
  DeactivateApplicationRequestSchema,
  DeactivateApplicationResponseSchema,
} from "../src/generated/zitadel/application/v2/application_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { applicationDeactivateApplicationRequestParse } from "../src/v2/applicationDeactivateApplicationRequestParse.js"
import { applicationServiceDeactivateApplication } from "../src/v2/applicationServiceDeactivateApplication.js"

describe("ApplicationService.DeactivateApplication", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await applicationDeactivateApplicationRequestParse({
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
    const response = create(DeactivateApplicationResponseSchema, {})

    const jsonResult = messageSerialize(DeactivateApplicationResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(DeactivateApplicationResponseSchema, response, "yaml")
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

    const result = await applicationServiceDeactivateApplication({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { applicationId: "application-1", projectId: "project-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "applicationServiceDeactivateApplication",
      errorMessage: "request failed",
    })
  })

  test("returns the typed deactivate response from the Connect client", async () => {
    const response = create(DeactivateApplicationResponseSchema, {
      deactivationDate: { nanos: 0, seconds: 1n },
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

    const result = await applicationServiceDeactivateApplication({
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
    expect(result.data.deactivationDate?.seconds).toBe(1n)
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
    expect(DeactivateApplicationRequestSchema.typeName).toBe("zitadel.application.v2.DeactivateApplicationRequest")
    expect(DeactivateApplicationResponseSchema.typeName).toBe("zitadel.application.v2.DeactivateApplicationResponse")
    expect(ApplicationService.methods.find(({ localName }) => localName === "deactivateApplication")?.name).toBe(
      "DeactivateApplication",
    )
  })
})

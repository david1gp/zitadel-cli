import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ApplicationService,
  GetApplicationRequestSchema,
  GetApplicationResponseSchema,
} from "../src/generated/zitadel/application/v2/application_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { applicationGetApplicationRequestParse } from "../src/v2/applicationGetApplicationRequestParse.js"
import { applicationServiceGetApplication } from "../src/v2/applicationServiceGetApplication.js"

describe("ApplicationService.GetApplication", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await applicationGetApplicationRequestParse({
      json: JSON.stringify({ applicationId: "application-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.applicationId).toBe("application-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(GetApplicationResponseSchema, {
      application: { applicationId: "application-1", name: "Console" },
    })

    const jsonResult = messageSerialize(GetApplicationResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      application: { applicationId: "application-1", name: "Console" },
    })

    const yamlResult = messageSerialize(GetApplicationResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      application: { applicationId: "application-1", name: "Console" },
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

    const result = await applicationServiceGetApplication({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "applicationServiceGetApplication",
      errorMessage: "request failed",
    })
  })

  test("returns the typed get response from the Connect client", async () => {
    const response = create(GetApplicationResponseSchema, {
      application: { applicationId: "application-1", name: "Console" },
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

    const result = await applicationServiceGetApplication({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { applicationId: "application-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.application?.applicationId).toBe("application-1")
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
    expect(GetApplicationRequestSchema.typeName).toBe("zitadel.application.v2.GetApplicationRequest")
    expect(GetApplicationResponseSchema.typeName).toBe("zitadel.application.v2.GetApplicationResponse")
    expect(ApplicationService.methods.find(({ localName }) => localName === "getApplication")?.name).toBe(
      "GetApplication",
    )
  })
})

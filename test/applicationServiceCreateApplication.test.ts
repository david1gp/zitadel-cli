import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ApplicationService,
  CreateApplicationRequestSchema,
  CreateApplicationResponseSchema,
} from "../src/generated/zitadel/application/v2/application_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { applicationCreateApplicationRequestParse } from "../src/v2/applicationCreateApplicationRequestParse.js"
import { applicationServiceCreateApplication } from "../src/v2/applicationServiceCreateApplication.js"

describe("ApplicationService.CreateApplication", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await applicationCreateApplicationRequestParse({
      json: JSON.stringify({
        applicationId: "application-1",
        name: "Console",
        oidcConfiguration: {
          redirectUris: ["https://example.test/callback"],
          responseTypes: ["OIDC_RESPONSE_TYPE_CODE"],
          grantTypes: ["OIDC_GRANT_TYPE_AUTHORIZATION_CODE"],
          applicationType: "OIDC_APP_TYPE_USER_AGENT",
          authMethodType: "OIDC_AUTH_METHOD_TYPE_NONE",
          version: "OIDC_VERSION_1_0",
        },
        projectId: "project-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.applicationId).toBe("application-1")
    expect(result.data.name).toBe("Console")
    expect(result.data.projectId).toBe("project-1")
    const applicationType = result.data.applicationType
    expect(applicationType?.case).toBe("oidcConfiguration")
    if (applicationType?.case !== "oidcConfiguration") {
      return
    }
    expect(applicationType.value.redirectUris).toEqual(["https://example.test/callback"])
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(CreateApplicationResponseSchema, { applicationId: "application-1" })

    const jsonResult = messageSerialize(CreateApplicationResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({ applicationId: "application-1" })

    const yamlResult = messageSerialize(CreateApplicationResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({ applicationId: "application-1" })
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

    const result = await applicationServiceCreateApplication({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "applicationServiceCreateApplication",
      errorMessage: "request failed",
    })
  })

  test("returns the typed create response from the Connect client", async () => {
    const response = create(CreateApplicationResponseSchema, { applicationId: "application-1" })
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

    const result = await applicationServiceCreateApplication({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        name: "Console",
        projectId: "project-1",
      },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.applicationId).toBe("application-1")
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
    expect(CreateApplicationRequestSchema.typeName).toBe("zitadel.application.v2.CreateApplicationRequest")
    expect(CreateApplicationResponseSchema.typeName).toBe("zitadel.application.v2.CreateApplicationResponse")
    expect(ApplicationService.methods.find(({ localName }) => localName === "createApplication")?.name).toBe(
      "CreateApplication",
    )
  })
})

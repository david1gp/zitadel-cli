import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ApplicationService,
  UpdateApplicationRequestSchema,
  UpdateApplicationResponseSchema,
} from "../src/generated/zitadel/application/v2/application_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { applicationServiceUpdateApplication } from "../src/v2/applicationServiceUpdateApplication.js"
import { applicationUpdateApplicationRequestParse } from "../src/v2/applicationUpdateApplicationRequestParse.js"

describe("ApplicationService.UpdateApplication", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await applicationUpdateApplicationRequestParse({
      json: JSON.stringify({
        applicationId: "application-1",
        name: "Updated application",
        oidcConfiguration: {
          applicationType: "OIDC_APP_TYPE_WEB",
          authMethodType: "OIDC_AUTH_METHOD_TYPE_BASIC",
          grantTypes: ["OIDC_GRANT_TYPE_AUTHORIZATION_CODE"],
          postLogoutRedirectUris: ["https://example.test/logout"],
          redirectUris: ["https://example.test/callback"],
          responseTypes: ["OIDC_RESPONSE_TYPE_CODE"],
        },
        projectId: "project-1",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.applicationId).toBe("application-1")
    expect(result.data.projectId).toBe("project-1")
    expect(result.data.name).toBe("Updated application")
    expect(result.data.applicationType?.case).toBe("oidcConfiguration")
    if (result.data.applicationType?.case !== "oidcConfiguration") {
      return
    }
    expect(result.data.applicationType.value.redirectUris).toEqual(["https://example.test/callback"])
    expect(result.data.applicationType.value.responseTypes).toEqual([1])
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(UpdateApplicationResponseSchema, {})

    const jsonResult = messageSerialize(UpdateApplicationResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({})

    const yamlResult = messageSerialize(UpdateApplicationResponseSchema, response, "yaml")
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

    const result = await applicationServiceUpdateApplication({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "applicationServiceUpdateApplication",
      errorMessage: "request failed",
    })
  })

  test("returns the typed update response from the Connect client", async () => {
    const response = create(UpdateApplicationResponseSchema, {})
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

    const result = await applicationServiceUpdateApplication({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        applicationId: "application-1",
        name: "Updated application",
        projectId: "project-1",
      },
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

  test("exposes the generated request and response descriptors", () => {
    expect(UpdateApplicationRequestSchema.typeName).toBe("zitadel.application.v2.UpdateApplicationRequest")
    expect(UpdateApplicationResponseSchema.typeName).toBe("zitadel.application.v2.UpdateApplicationResponse")
    expect(ApplicationService.methods.find(({ localName }) => localName === "updateApplication")?.name).toBe(
      "UpdateApplication",
    )
  })
})

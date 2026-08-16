import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import {
  ActionService,
  UpdateTargetRequestSchema,
  UpdateTargetResponseSchema,
} from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { actionServiceUpdateTarget } from "../src/v2/actionServiceUpdateTarget.js"
import { actionUpdateTargetRequestParse } from "../src/v2/actionUpdateTargetRequestParse.js"

describe("ActionService.UpdateTarget", () => {
  test("parses the complete generated protobuf JSON request", async () => {
    const result = await actionUpdateTargetRequestParse({
      json: JSON.stringify({
        endpoint: "https://example.test/action",
        expirationSigningKey: "0s",
        id: "target-1",
        name: "Example",
        payloadType: "PAYLOAD_TYPE_JWT",
        restCall: { interruptOnError: true },
        timeout: "30s",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.id).toBe("target-1")
    expect(result.data.name).toBe("Example")
    expect(result.data.endpoint).toBe("https://example.test/action")
    expect(result.data.payloadType).toBe(2)
    expect(result.data.timeout?.seconds).toBe(30n)
    expect(result.data.expirationSigningKey?.seconds).toBe(0n)
    expect(result.data.targetType?.case).toBe("restCall")
    if (result.data.targetType?.case !== "restCall") {
      return
    }
    expect(result.data.targetType.value.interruptOnError).toBe(true)
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(UpdateTargetResponseSchema, {
      changeDate: { seconds: 1n },
      signingKey: "signing-key",
    })

    const jsonResult = messageSerialize(UpdateTargetResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      changeDate: "1970-01-01T00:00:01Z",
      signingKey: "signing-key",
    })

    const yamlResult = messageSerialize(UpdateTargetResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual({
      changeDate: "1970-01-01T00:00:01Z",
      signingKey: "signing-key",
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

    const result = await actionServiceUpdateTarget({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "actionServiceUpdateTarget",
      errorMessage: "request failed",
    })
  })

  test("returns the typed update response from the Connect client", async () => {
    const response = create(UpdateTargetResponseSchema, { signingKey: "signing-key" })
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

    const result = await actionServiceUpdateTarget({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: {
        endpoint: "https://example.test/action",
        id: "target-1",
        name: "Example",
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
    expect(UpdateTargetRequestSchema.typeName).toBe("zitadel.action.v2.UpdateTargetRequest")
    expect(UpdateTargetResponseSchema.typeName).toBe("zitadel.action.v2.UpdateTargetResponse")
    expect(ActionService.methods.find(({ localName }) => localName === "updateTarget")?.name).toBe("UpdateTarget")
  })
})

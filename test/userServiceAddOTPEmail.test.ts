import { describe, expect, test } from "bun:test"
import { create } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { DetailsSchema } from "../src/generated/zitadel/object/v2/object_pb.js"
import {
  AddOTPEmailRequestSchema,
  AddOTPEmailResponseSchema,
} from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { userAddOTPEmailRequestParse } from "../src/v2/userAddOTPEmailRequestParse.js"
import { UserService } from "../src/v2/userService.js"
import { userServiceAddOTPEmail } from "../src/v2/userServiceAddOTPEmail.js"

describe("UserService.AddOTPEmail", () => {
  test("parses the generated protobuf JSON request", async () => {
    const result = await userAddOTPEmailRequestParse({
      json: JSON.stringify({ userId: "user-1" }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.userId).toBe("user-1")
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(AddOTPEmailResponseSchema, {
      details: create(DetailsSchema, {
        resourceOwner: "org-1",
        sequence: 7n,
      }),
    })

    const jsonResult = messageSerialize(AddOTPEmailResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      details: { resourceOwner: "org-1", sequence: "7" },
    })

    const yamlResult = messageSerialize(AddOTPEmailResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlResult.data).toContain("resourceOwner: org-1")
    expect(yamlResult.data).toContain('sequence: "7"')
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

    const result = await userServiceAddOTPEmail({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "userServiceAddOTPEmail",
      errorMessage: "request failed",
    })
  })

  test("returns the typed response from the Connect client", async () => {
    const response = create(AddOTPEmailResponseSchema, {
      details: create(DetailsSchema, {
        resourceOwner: "org-1",
        sequence: 7n,
      }),
    })
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async () => ({
        header: new Headers(),
        message: response,
        service: UserService,
        stream: false,
        trailer: new Headers(),
      }),
    } as unknown as Transport

    const result = await userServiceAddOTPEmail({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { userId: "user-1" },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.details?.resourceOwner).toBe("org-1")
  })

  test("exposes the generated request and response descriptors", () => {
    expect(AddOTPEmailRequestSchema.typeName).toBe("zitadel.user.v2.AddOTPEmailRequest")
    expect(AddOTPEmailResponseSchema.typeName).toBe("zitadel.user.v2.AddOTPEmailResponse")
    expect(UserService.methods.find(({ localName }) => localName === "addOTPEmail")?.name).toBe("AddOTPEmail")
  })
})

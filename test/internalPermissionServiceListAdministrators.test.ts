import { describe, expect, test } from "bun:test"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { create } from "@bufbuild/protobuf"
import type { StreamRequest, Transport, UnaryRequest, UnaryResponse } from "@connectrpc/connect"
import { parse as yamlParse } from "yaml"
import { zitadelConfigCreate } from "../src/config/zitadelConfigCreate.js"
import {
  InternalPermissionService,
  ListAdministratorsRequestSchema,
  ListAdministratorsResponseSchema,
} from "../src/generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { messageSerialize } from "../src/output/messageSerialize.js"
import { zitadelBearerInterceptorCreate } from "../src/transport/zitadelBearerInterceptorCreate.js"
import { internalPermissionListAdministratorsRequestParse } from "../src/v2/internalPermissionListAdministratorsRequestParse.js"
import { internalPermissionServiceListAdministrators } from "../src/v2/internalPermissionServiceListAdministrators.js"

describe("InternalPermissionService.ListAdministrators", () => {
  test("loads a selected env file with process and flag precedence", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-cli-"))
    const envFile = join(directory, ".env.test")

    try {
      await writeFile(
        envFile,
        ["ZITADEL_BASE_URL=https://from-file.example/", 'export ZITADEL_TOKEN="from-file"', ""].join("\n"),
      )

      const fileResult = await zitadelConfigCreate({ env: {}, envFile })
      expect(fileResult).toEqual({
        success: true,
        data: {
          baseUrl: "https://from-file.example",
          token: "from-file",
        },
      })

      const environmentResult = await zitadelConfigCreate({
        env: {
          ZITADEL_BASE_URL: "https://from-environment.example/",
          ZITADEL_TOKEN: "from-environment",
        },
        envFile,
      })
      expect(environmentResult).toEqual({
        success: true,
        data: {
          baseUrl: "https://from-environment.example",
          token: "from-environment",
        },
      })

      const flagResult = await zitadelConfigCreate({
        baseUrl: "https://from-flag.example/",
        env: {
          ZITADEL_BASE_URL: "https://from-environment.example/",
          ZITADEL_TOKEN: "from-environment",
        },
        envFile,
        token: "from-flag",
      })
      expect(flagResult).toEqual({
        success: true,
        data: {
          baseUrl: "https://from-flag.example",
          token: "from-flag",
        },
      })
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("parses the complete generated protobuf JSON request", async () => {
    const result = await internalPermissionListAdministratorsRequestParse({
      json: JSON.stringify({
        filters: [
          {
            inUserIdsFilter: {
              ids: ["user-1", "user-2"],
            },
          },
        ],
        pagination: {
          asc: true,
          limit: 25,
          offset: "2",
        },
        sortingColumn: "ADMINISTRATOR_FIELD_NAME_CREATION_DATE",
      }),
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }

    expect(result.data.pagination?.asc).toBe(true)
    expect(result.data.pagination?.limit).toBe(25)
    expect(result.data.pagination?.offset).toBe(2n)
    expect(result.data.sortingColumn).toBe(2)

    const filter = result.data.filters?.[0]
    expect(filter?.filter?.case).toBe("inUserIdsFilter")
    if (filter?.filter === undefined || filter.filter.case !== "inUserIdsFilter") {
      return
    }
    expect(filter.filter.value.ids).toEqual(["user-1", "user-2"])
  })

  test("returns JSON and YAML using protobuf serialization", () => {
    const response = create(ListAdministratorsResponseSchema, {
      administrators: [
        {
          user: { id: "user-1", displayName: "Example User" },
          resource: { case: "instance", value: true },
          roles: ["IAM_OWNER"],
        },
      ],
    })

    const jsonResult = messageSerialize(ListAdministratorsResponseSchema, response, "json")
    expect(jsonResult.success).toBe(true)
    if (!jsonResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual({
      administrators: [
        {
          user: { id: "user-1", displayName: "Example User" },
          instance: true,
          roles: ["IAM_OWNER"],
        },
      ],
    })

    const yamlResult = messageSerialize(ListAdministratorsResponseSchema, response, "yaml")
    expect(yamlResult.success).toBe(true)
    if (!yamlResult.success) {
      return
    }
    expect(yamlParse(yamlResult.data)).toEqual(JSON.parse(jsonResult.data))
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

    const result = await internalPermissionServiceListAdministrators({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      transport,
    })

    expect(result).toEqual({
      success: false,
      op: "internalPermissionServiceListAdministrators",
      errorMessage: "request failed",
    })
  })

  test("returns the typed list response from the Connect client", async () => {
    const response = create(ListAdministratorsResponseSchema, {
      administrators: [{ user: { id: "user-1" }, roles: ["IAM_OWNER"] }],
    })
    const transport = {
      stream: async () => {
        throw new Error("unexpected stream")
      },
      unary: async () => ({
        header: new Headers(),
        message: response,
        service: InternalPermissionService,
        stream: false,
        trailer: new Headers(),
      }),
    } as unknown as Transport

    const result = await internalPermissionServiceListAdministrators({
      config: {
        baseUrl: "https://example.test",
        token: "token",
      },
      request: { sortingColumn: 2 },
      transport,
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      return
    }
    expect(result.data.administrators[0]?.user?.id).toBe("user-1")
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
    expect(ListAdministratorsRequestSchema.typeName).toBe("zitadel.internal_permission.v2.ListAdministratorsRequest")
    expect(ListAdministratorsResponseSchema.typeName).toBe("zitadel.internal_permission.v2.ListAdministratorsResponse")
    expect(InternalPermissionService.methods.find(({ localName }) => localName === "listAdministrators")?.name).toBe(
      "ListAdministrators",
    )
  })
})

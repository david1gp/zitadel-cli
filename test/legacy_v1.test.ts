import { describe, expect, test } from "bun:test"
import { generateHelpTextForAllCommands } from "@stricli/core"
import { SERVICE_CATALOG } from "../src/index.js"
import { zitadelCliApplication } from "../src/cli/zitadelCliApplication.js"
import {
  AddGoogleProviderRequestSchema,
  AddGoogleProviderResponseSchema,
  AdminService,
  ListIDPsRequestSchema,
  ListIDPsResponseSchema,
} from "../src/legacy_v1/index.js"

describe("legacy_v1 adapter", () => {
  test("exposes only the two approved AdminService methods", () => {
    expect(AdminService.methods.map(({ localName }) => localName)).toEqual(["listIDPs", "addGoogleProvider"])
    expect(AdminService.typeName).toBe("zitadel.admin.v1.AdminService")
  })

  test("keeps legacy methods isolated in the supported catalog", () => {
    const legacyService = SERVICE_CATALOG.find(({ apiVersion }) => apiVersion === "legacy_v1")

    expect(legacyService?.serviceName).toBe("AdminService")
    expect(legacyService?.methods.map(({ methodName }) => methodName)).toEqual(["ListIDPs", "AddGoogleProvider"])
  })

  test("exports the approved generated request and response descriptors", () => {
    expect(ListIDPsRequestSchema.typeName).toBe("zitadel.admin.v1.ListIDPsRequest")
    expect(ListIDPsResponseSchema.typeName).toBe("zitadel.admin.v1.ListIDPsResponse")
    expect(AddGoogleProviderRequestSchema.typeName).toBe("zitadel.admin.v1.AddGoogleProviderRequest")
    expect(AddGoogleProviderResponseSchema.typeName).toBe("zitadel.admin.v1.AddGoogleProviderResponse")
  })

  test("registers only the approved legacy v1 CLI help routes", () => {
    const legacyCommands = generateHelpTextForAllCommands(zitadelCliApplication).filter(([route]) =>
      route.startsWith("zitadel-cli legacy-v1 "),
    )

    expect(legacyCommands.map(([route]) => route)).toEqual([
      "zitadel-cli legacy-v1 add-google-provider",
      "zitadel-cli legacy-v1 list-idps",
    ])
    expect(legacyCommands[0]?.[1]).toContain(
      "https://zitadel.com/docs/reference/api/admin/zitadel.admin.v1.AdminService.AddGoogleProvider",
    )
    expect(legacyCommands[1]?.[1]).toContain(
      "https://zitadel.com/docs/reference/api/admin/zitadel.admin.v1.AdminService.ListIDPs",
    )
  })

  test("does not expose legacy v1 methods from the stable root barrel", async () => {
    const stableExports = await import("../src/index.js")

    expect("AdminService" in stableExports).toBe(false)
    expect("ListIDPsRequestSchema" in stableExports).toBe(false)
    expect("AddGoogleProviderRequestSchema" in stableExports).toBe(false)
  })
})

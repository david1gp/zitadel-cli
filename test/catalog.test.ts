import { describe, expect, test } from "bun:test"
import { ActionService as GeneratedActionService } from "../src/generated/zitadel/action/v2/action_service_pb.js"
import { ApplicationService as GeneratedApplicationService } from "../src/generated/zitadel/application/v2/application_service_pb.js"
import { InternalPermissionService as GeneratedInternalPermissionService } from "../src/generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { OrganizationService as GeneratedOrganizationService } from "../src/generated/zitadel/org/v2/org_service_pb.js"
import { ProjectService as GeneratedProjectService } from "../src/generated/zitadel/project/v2/project_service_pb.js"
import { UserService as GeneratedUserService } from "../src/generated/zitadel/user/v2/user_service_pb.js"
import { METHOD_CATALOG, SERVICE_CATALOG, V2_SERVICE_CATALOG } from "../src/index.js"

const deprecatedUserMethods = new Set([
  "addHumanUser",
  "passwordReset",
  "removePhone",
  "resendInviteCode",
  "setEmail",
  "setPhone",
  "updateHumanUser",
])

describe("supported catalog", () => {
  test("covers every non-deprecated method in the six stable descriptors", () => {
    const generatedServices = [
      GeneratedProjectService,
      GeneratedApplicationService,
      GeneratedUserService,
      GeneratedInternalPermissionService,
      GeneratedOrganizationService,
      GeneratedActionService,
    ]

    for (const generatedService of generatedServices) {
      const catalogService = V2_SERVICE_CATALOG.find(({ typeName }) => typeName === generatedService.typeName)
      expect(catalogService).toBeDefined()

      const expectedMethods = generatedService.methods
        .filter(
          ({ deprecated, localName }) =>
            !deprecated && (generatedService !== GeneratedUserService || !deprecatedUserMethods.has(localName)),
        )
        .map(({ localName, name }) => `${localName}:${name}`)
      const catalogMethods = catalogService?.methods.map(({ methodKey, methodName }) => `${methodKey}:${methodName}`)
      expect(catalogMethods).toEqual(expectedMethods)
    }
  })

  test("excludes deprecated user methods", () => {
    const userService = V2_SERVICE_CATALOG.find(({ typeName }) => typeName === GeneratedUserService.typeName)
    const catalogMethodNames = userService?.methods.map(({ methodName }) => methodName) ?? []

    for (const methodKey of deprecatedUserMethods) {
      expect(catalogMethodNames).not.toContain(
        GeneratedUserService.methods.find(({ localName }) => localName === methodKey)?.name,
      )
    }
  })

  test("provides an official documentation URL for every supported method", () => {
    expect(METHOD_CATALOG).toHaveLength(
      V2_SERVICE_CATALOG.reduce((count, service) => count + service.methods.length, 0) + 2,
    )

    for (const method of METHOD_CATALOG) {
      expect(method.docsUrl).toBe(
        `https://zitadel.com/docs/reference/api/${SERVICE_CATALOG.find(({ typeName }) => typeName === method.service.typeName)?.docsCategory}/${method.service.typeName}.${method.methodName}`,
      )
    }
  })
})

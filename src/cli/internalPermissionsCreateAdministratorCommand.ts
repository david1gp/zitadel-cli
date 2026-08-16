import { CreateAdministratorResponseSchema } from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { internalPermissionCreateAdministratorRequestParse } from "../v2/internalPermissionCreateAdministratorRequestParse.js"
import { internalPermissionServiceCreateAdministrator } from "../v2/internalPermissionServiceCreateAdministrator.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command definition for InternalPermissionService.CreateAdministrator.
 *
 * @see https://zitadel.com/docs/reference/api/internal_permission/zitadel.internal_permission.v2.InternalPermissionService.CreateAdministrator
 */
export const internalPermissionsCreateAdministratorCommand = endpointCommandBuild({
  call: internalPermissionServiceCreateAdministrator,
  docs: {
    brief: "Grant an administrator role to a user for a specific resource",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated CreateAdministrator protobuf JSON shape.",
  },
  operation: "internalPermissionsCreateAdministratorCommandRun",
  requestName: "CreateAdministrator",
  requestParse: internalPermissionCreateAdministratorRequestParse,
  responseSchema: CreateAdministratorResponseSchema,
})

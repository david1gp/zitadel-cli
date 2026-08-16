import { UpdateAdministratorResponseSchema } from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { internalPermissionUpdateAdministratorRequestParse } from "../v2/internalPermissionUpdateAdministratorRequestParse.js"
import { internalPermissionServiceUpdateAdministrator } from "../v2/internalPermissionServiceUpdateAdministrator.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command definition for InternalPermissionService.UpdateAdministrator.
 *
 * @see https://zitadel.com/docs/reference/api/internal_permission/zitadel.internal_permission.v2.InternalPermissionService.UpdateAdministrator
 */
export const internalPermissionsUpdateAdministratorCommand = endpointCommandBuild({
  call: internalPermissionServiceUpdateAdministrator,
  docs: {
    brief: "Update administrator roles for a user and resource",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated UpdateAdministrator protobuf JSON shape.",
  },
  operation: "internalPermissionsUpdateAdministratorCommandRun",
  requestName: "UpdateAdministrator",
  requestParse: internalPermissionUpdateAdministratorRequestParse,
  responseSchema: UpdateAdministratorResponseSchema,
})

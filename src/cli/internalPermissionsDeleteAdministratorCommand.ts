import { DeleteAdministratorResponseSchema } from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { internalPermissionDeleteAdministratorRequestParse } from "../v2/internalPermissionDeleteAdministratorRequestParse.js"
import { internalPermissionServiceDeleteAdministrator } from "../v2/internalPermissionServiceDeleteAdministrator.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command definition for InternalPermissionService.DeleteAdministrator.
 *
 * @see https://zitadel.com/docs/reference/api/internal_permission/zitadel.internal_permission.v2.InternalPermissionService.DeleteAdministrator
 */
export const internalPermissionsDeleteAdministratorCommand = endpointCommandBuild({
  call: internalPermissionServiceDeleteAdministrator,
  docs: {
    brief: "Delete an administrator role for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeleteAdministrator protobuf JSON shape.",
  },
  operation: "internalPermissionsDeleteAdministratorCommandRun",
  requestName: "DeleteAdministrator",
  requestParse: internalPermissionDeleteAdministratorRequestParse,
  responseSchema: DeleteAdministratorResponseSchema,
})

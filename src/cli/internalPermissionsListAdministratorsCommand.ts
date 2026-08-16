import { ListAdministratorsResponseSchema } from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { internalPermissionListAdministratorsRequestParse } from "../v2/internalPermissionListAdministratorsRequestParse.js"
import { internalPermissionServiceListAdministrators } from "../v2/internalPermissionServiceListAdministrators.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command definition for InternalPermissionService.ListAdministrators.
 *
 * @see https://zitadel.com/docs/reference/api/internal_permission/zitadel.internal_permission.v2.InternalPermissionService.ListAdministrators
 */
export const internalPermissionsListAdministratorsCommand = endpointCommandBuild({
  call: internalPermissionServiceListAdministrators,
  docs: {
    brief: "List administrators visible to the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListAdministrators protobuf JSON shape.",
  },
  operation: "internalPermissionsListAdministratorsCommandRun",
  requestName: "ListAdministrators",
  requestParse: internalPermissionListAdministratorsRequestParse,
  responseSchema: ListAdministratorsResponseSchema,
})

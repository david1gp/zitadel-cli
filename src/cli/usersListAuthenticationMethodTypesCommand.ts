import { ListAuthenticationMethodTypesResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userListAuthenticationMethodTypesRequestParse } from "../v2/userListAuthenticationMethodTypesRequestParse.js"
import { userServiceListAuthenticationMethodTypes } from "../v2/userServiceListAuthenticationMethodTypes.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.ListAuthenticationMethodTypes.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListAuthenticationMethodTypes
 */
export const usersListAuthenticationMethodTypesCommand = endpointCommandBuild({
  call: userServiceListAuthenticationMethodTypes,
  docs: {
    brief: "List available authentication method types for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListAuthenticationMethodTypes protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListAuthenticationMethodTypes",
  },
  operation: "usersListAuthenticationMethodTypesCommandRun",
  requestName: "ListAuthenticationMethodTypes",
  requestParse: userListAuthenticationMethodTypesRequestParse,
  responseSchema: ListAuthenticationMethodTypesResponseSchema,
})

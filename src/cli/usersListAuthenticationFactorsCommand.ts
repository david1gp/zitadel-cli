import { ListAuthenticationFactorsResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userListAuthenticationFactorsRequestParse } from "../v2/userListAuthenticationFactorsRequestParse.js"
import { userServiceListAuthenticationFactors } from "../v2/userServiceListAuthenticationFactors.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.ListAuthenticationFactors.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListAuthenticationFactors
 */
export const usersListAuthenticationFactorsCommand = endpointCommandBuild({
  call: userServiceListAuthenticationFactors,
  docs: {
    brief: "List authentication factors for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListAuthenticationFactors protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListAuthenticationFactors",
  },
  operation: "usersListAuthenticationFactorsCommandRun",
  requestName: "ListAuthenticationFactors",
  requestParse: userListAuthenticationFactorsRequestParse,
  responseSchema: ListAuthenticationFactorsResponseSchema,
})

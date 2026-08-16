import { ListPersonalAccessTokensResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userListPersonalAccessTokensRequestParse } from "../v2/userListPersonalAccessTokensRequestParse.js"
import { userServiceListPersonalAccessTokens } from "../v2/userServiceListPersonalAccessTokens.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.ListPersonalAccessTokens.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListPersonalAccessTokens
 */
export const usersListPersonalAccessTokensCommand = endpointCommandBuild({
  call: userServiceListPersonalAccessTokens,
  docs: {
    brief: "List personal access tokens visible to the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListPersonalAccessTokens protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListPersonalAccessTokens",
  },
  operation: "usersListPersonalAccessTokensCommandRun",
  requestName: "ListPersonalAccessTokens",
  requestParse: userListPersonalAccessTokensRequestParse,
  responseSchema: ListPersonalAccessTokensResponseSchema,
})

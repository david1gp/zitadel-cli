import { RemovePersonalAccessTokenResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRemovePersonalAccessTokenRequestParse } from "../v2/userRemovePersonalAccessTokenRequestParse.js"
import { userServiceRemovePersonalAccessToken } from "../v2/userServiceRemovePersonalAccessToken.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.RemovePersonalAccessToken.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemovePersonalAccessToken
 */
export const usersRemovePersonalAccessTokenCommand = endpointCommandBuild({
  call: userServiceRemovePersonalAccessToken,
  docs: {
    brief: "Remove a personal access token from a machine user",
    fullDescription:
      "Removes a personal access token from a machine user. Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RemovePersonalAccessToken protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemovePersonalAccessToken",
  },
  operation: "usersRemovePersonalAccessTokenCommandRun",
  requestName: "RemovePersonalAccessToken",
  requestParse: userRemovePersonalAccessTokenRequestParse,
  responseSchema: RemovePersonalAccessTokenResponseSchema,
})

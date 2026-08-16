import { AddPersonalAccessTokenResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userAddPersonalAccessTokenRequestParse } from "../v2/userAddPersonalAccessTokenRequestParse.js"
import { userServiceAddPersonalAccessToken } from "../v2/userServiceAddPersonalAccessToken.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.AddPersonalAccessToken.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddPersonalAccessToken
 */
export const usersAddPersonalAccessTokenCommand = endpointCommandBuild({
  call: userServiceAddPersonalAccessToken,
  docs: {
    brief: "Add a personal access token to a machine user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated AddPersonalAccessToken protobuf JSON shape. The returned token is shown only once and cannot be recovered. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddPersonalAccessToken",
  },
  operation: "usersAddPersonalAccessTokenCommandRun",
  requestName: "AddPersonalAccessToken",
  requestParse: userAddPersonalAccessTokenRequestParse,
  responseSchema: AddPersonalAccessTokenResponseSchema,
})

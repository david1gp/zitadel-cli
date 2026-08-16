import { StartIdentityProviderIntentResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userServiceStartIdentityProviderIntent } from "../v2/userServiceStartIdentityProviderIntent.js"
import { userStartIdentityProviderIntentRequestParse } from "../v2/userStartIdentityProviderIntentRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.StartIdentityProviderIntent.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.StartIdentityProviderIntent
 */
export const usersStartIdentityProviderIntentCommand = endpointCommandBuild({
  call: userServiceStartIdentityProviderIntent,
  docs: {
    brief: "Start an identity provider intent",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated StartIdentityProviderIntent protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.StartIdentityProviderIntent",
  },
  operation: "usersStartIdentityProviderIntentCommandRun",
  requestName: "StartIdentityProviderIntent",
  requestParse: userStartIdentityProviderIntentRequestParse,
  responseSchema: StartIdentityProviderIntentResponseSchema,
})

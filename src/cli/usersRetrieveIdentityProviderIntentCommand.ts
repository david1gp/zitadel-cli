import { RetrieveIdentityProviderIntentResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRetrieveIdentityProviderIntentRequestParse } from "../v2/userRetrieveIdentityProviderIntentRequestParse.js"
import { userServiceRetrieveIdentityProviderIntent } from "../v2/userServiceRetrieveIdentityProviderIntent.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.RetrieveIdentityProviderIntent.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RetrieveIdentityProviderIntent
 */
export const usersRetrieveIdentityProviderIntentCommand = endpointCommandBuild({
  call: userServiceRetrieveIdentityProviderIntent,
  docs: {
    brief: "Retrieve identity provider intent information",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RetrieveIdentityProviderIntent protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RetrieveIdentityProviderIntent",
  },
  operation: "usersRetrieveIdentityProviderIntentCommandRun",
  requestName: "RetrieveIdentityProviderIntent",
  requestParse: userRetrieveIdentityProviderIntentRequestParse,
  responseSchema: RetrieveIdentityProviderIntentResponseSchema,
})

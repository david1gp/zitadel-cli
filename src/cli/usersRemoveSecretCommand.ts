import { RemoveSecretResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRemoveSecretRequestParse } from "../v2/userRemoveSecretRequestParse.js"
import { userServiceRemoveSecret } from "../v2/userServiceRemoveSecret.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.RemoveSecret.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveSecret
 */
export const usersRemoveSecretCommand = endpointCommandBuild({
  call: userServiceRemoveSecret,
  docs: {
    brief: "Remove the client ID and client secret from a service account",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RemoveSecret protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveSecret",
  },
  operation: "usersRemoveSecretCommandRun",
  requestName: "RemoveSecret",
  requestParse: userRemoveSecretRequestParse,
  responseSchema: RemoveSecretResponseSchema,
})

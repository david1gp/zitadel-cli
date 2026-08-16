import { RemovePasskeyResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRemovePasskeyRequestParse } from "../v2/userRemovePasskeyRequestParse.js"
import { userServiceRemovePasskey } from "../v2/userServiceRemovePasskey.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.RemovePasskey.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemovePasskey
 */
export const usersRemovePasskeyCommand = endpointCommandBuild({
  call: userServiceRemovePasskey,
  docs: {
    brief: "Remove a passkey from a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RemovePasskey protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemovePasskey",
  },
  operation: "usersRemovePasskeyCommandRun",
  requestName: "RemovePasskey",
  requestParse: userRemovePasskeyRequestParse,
  responseSchema: RemovePasskeyResponseSchema,
})

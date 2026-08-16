import { RemoveKeyResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRemoveKeyRequestParse } from "../v2/userRemoveKeyRequestParse.js"
import { userServiceRemoveKey } from "../v2/userServiceRemoveKey.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.RemoveKey.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveKey
 */
export const usersRemoveKeyCommand = endpointCommandBuild({
  call: userServiceRemoveKey,
  docs: {
    brief: "Remove a key from a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RemoveKey protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveKey",
  },
  operation: "usersRemoveKeyCommandRun",
  requestName: "RemoveKey",
  requestParse: userRemoveKeyRequestParse,
  responseSchema: RemoveKeyResponseSchema,
})

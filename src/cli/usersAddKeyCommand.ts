import { AddKeyResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userAddKeyRequestParse } from "../v2/userAddKeyRequestParse.js"
import { userServiceAddKey } from "../v2/userServiceAddKey.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.AddKey.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddKey
 */
export const usersAddKeyCommand = endpointCommandBuild({
  call: userServiceAddKey,
  docs: {
    brief: "Add a key for a machine user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated AddKey protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddKey",
  },
  operation: "usersAddKeyCommandRun",
  requestName: "AddKey",
  requestParse: userAddKeyRequestParse,
  responseSchema: AddKeyResponseSchema,
})

import { ListKeysResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userListKeysRequestParse } from "../v2/userListKeysRequestParse.js"
import { userServiceListKeys } from "../v2/userServiceListKeys.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.ListKeys.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListKeys
 */
export const usersListKeysCommand = endpointCommandBuild({
  call: userServiceListKeys,
  docs: {
    brief: "List user keys",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListKeys protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListKeys",
  },
  operation: "usersListKeysCommandRun",
  requestName: "ListKeys",
  requestParse: userListKeysRequestParse,
  responseSchema: ListKeysResponseSchema,
})

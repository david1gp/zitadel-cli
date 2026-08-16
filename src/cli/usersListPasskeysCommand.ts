import { ListPasskeysResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userListPasskeysRequestParse } from "../v2/userListPasskeysRequestParse.js"
import { userServiceListPasskeys } from "../v2/userServiceListPasskeys.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.ListPasskeys.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListPasskeys
 */
export const usersListPasskeysCommand = endpointCommandBuild({
  call: userServiceListPasskeys,
  docs: {
    brief: "List passkeys for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListPasskeys protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListPasskeys",
  },
  operation: "usersListPasskeysCommandRun",
  requestName: "ListPasskeys",
  requestParse: userListPasskeysRequestParse,
  responseSchema: ListPasskeysResponseSchema,
})

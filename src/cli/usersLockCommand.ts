import { LockUserResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userLockUserRequestParse } from "../v2/userLockUserRequestParse.js"
import { userServiceLockUser } from "../v2/userServiceLockUser.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.LockUser.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.LockUser
 */
export const usersLockCommand = endpointCommandBuild({
  call: userServiceLockUser,
  docs: {
    brief: "Lock a user for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated LockUser protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.LockUser",
  },
  operation: "usersLockCommandRun",
  requestName: "LockUser",
  requestParse: userLockUserRequestParse,
  responseSchema: LockUserResponseSchema,
})

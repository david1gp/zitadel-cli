import { UnlockUserResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userServiceUnlockUser } from "../v2/userServiceUnlockUser.js"
import { userUnlockUserRequestParse } from "../v2/userUnlockUserRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.UnlockUser.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.UnlockUser
 */
export const usersUnlockCommand = endpointCommandBuild({
  call: userServiceUnlockUser,
  docs: {
    brief: "Unlock a locked user for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated UnlockUser protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.UnlockUser",
  },
  operation: "usersUnlockCommandRun",
  requestName: "UnlockUser",
  requestParse: userUnlockUserRequestParse,
  responseSchema: UnlockUserResponseSchema,
})

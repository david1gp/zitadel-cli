import { DeactivateUserResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userDeactivateUserRequestParse } from "../v2/userDeactivateUserRequestParse.js"
import { userServiceDeactivateUser } from "../v2/userServiceDeactivateUser.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.DeactivateUser.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.DeactivateUser
 */
export const usersDeactivateCommand = endpointCommandBuild({
  call: userServiceDeactivateUser,
  docs: {
    brief: "Deactivate a user for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeactivateUser protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.DeactivateUser",
  },
  operation: "usersDeactivateCommandRun",
  requestName: "DeactivateUser",
  requestParse: userDeactivateUserRequestParse,
  responseSchema: DeactivateUserResponseSchema,
})

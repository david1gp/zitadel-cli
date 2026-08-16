import { ReactivateUserResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userReactivateUserRequestParse } from "../v2/userReactivateUserRequestParse.js"
import { userServiceReactivateUser } from "../v2/userServiceReactivateUser.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.ReactivateUser.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ReactivateUser
 */
export const usersReactivateCommand = endpointCommandBuild({
  call: userServiceReactivateUser,
  docs: {
    brief: "Reactivate a deactivated user for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ReactivateUser protobuf JSON shape.",
  },
  operation: "usersReactivateCommandRun",
  requestName: "ReactivateUser",
  requestParse: userReactivateUserRequestParse,
  responseSchema: ReactivateUserResponseSchema,
})

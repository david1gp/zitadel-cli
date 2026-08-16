import { UpdateUserResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userServiceUpdateUser } from "../v2/userServiceUpdateUser.js"
import { userUpdateUserRequestParse } from "../v2/userUpdateUserRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.UpdateUser.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.UpdateUser
 */
export const usersUpdateCommand = endpointCommandBuild({
  call: userServiceUpdateUser,
  docs: {
    brief: "Partially update a user for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated UpdateUser protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.UpdateUser",
  },
  operation: "usersUpdateCommandRun",
  requestName: "UpdateUser",
  requestParse: userUpdateUserRequestParse,
  responseSchema: UpdateUserResponseSchema,
})

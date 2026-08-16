import { DeleteUserResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userDeleteUserRequestParse } from "../v2/userDeleteUserRequestParse.js"
import { userServiceDeleteUser } from "../v2/userServiceDeleteUser.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.DeleteUser.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.DeleteUser
 */
export const usersDeleteCommand = endpointCommandBuild({
  call: userServiceDeleteUser,
  docs: {
    brief: "Delete a user for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeleteUser protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.DeleteUser",
  },
  operation: "usersDeleteCommandRun",
  requestName: "DeleteUser",
  requestParse: userDeleteUserRequestParse,
  responseSchema: DeleteUserResponseSchema,
})

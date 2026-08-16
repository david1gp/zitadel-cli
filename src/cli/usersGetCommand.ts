import { GetUserByIDResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userGetUserByIDRequestParse } from "../v2/userGetUserByIDRequestParse.js"
import { userServiceGetUserByID } from "../v2/userServiceGetUserByID.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.GetUserByID.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.GetUserByID
 */
export const usersGetCommand = endpointCommandBuild({
  call: userServiceGetUserByID,
  docs: {
    brief: "Get a user by ID",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated GetUserByID protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.GetUserByID",
  },
  operation: "usersGetCommandRun",
  requestName: "GetUserByID",
  requestParse: userGetUserByIDRequestParse,
  responseSchema: GetUserByIDResponseSchema,
})

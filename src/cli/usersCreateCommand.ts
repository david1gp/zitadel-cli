import { CreateUserResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userCreateUserRequestParse } from "../v2/userCreateUserRequestParse.js"
import { userServiceCreateUser } from "../v2/userServiceCreateUser.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.CreateUser.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreateUser
 */
export const usersCreateCommand = endpointCommandBuild({
  call: userServiceCreateUser,
  docs: {
    brief: "Create a user or service account in an organization",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated CreateUser protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreateUser",
  },
  operation: "usersCreateCommandRun",
  requestName: "CreateUser",
  requestParse: userCreateUserRequestParse,
  responseSchema: CreateUserResponseSchema,
})

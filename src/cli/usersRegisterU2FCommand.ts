import { RegisterU2FResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRegisterU2FRequestParse } from "../v2/userRegisterU2FRequestParse.js"
import { userServiceRegisterU2F } from "../v2/userServiceRegisterU2F.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.RegisterU2F.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RegisterU2F
 */
export const usersRegisterU2FCommand = endpointCommandBuild({
  call: userServiceRegisterU2F,
  docs: {
    brief: "Start U2F registration for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RegisterU2F protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RegisterU2F",
  },
  operation: "usersRegisterU2FCommandRun",
  requestName: "RegisterU2F",
  requestParse: userRegisterU2FRequestParse,
  responseSchema: RegisterU2FResponseSchema,
})

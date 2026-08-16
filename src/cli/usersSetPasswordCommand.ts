import { SetPasswordResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userSetPasswordRequestParse } from "../v2/userSetPasswordRequestParse.js"
import { userServiceSetPassword } from "../v2/userServiceSetPassword.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.SetPassword.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.SetPassword
 */
export const usersSetPasswordCommand = endpointCommandBuild({
  call: userServiceSetPassword,
  docs: {
    brief: "Change a user's password",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated SetPassword protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.SetPassword",
  },
  operation: "usersSetPasswordCommandRun",
  requestName: "SetPassword",
  requestParse: userSetPasswordRequestParse,
  responseSchema: SetPasswordResponseSchema,
})

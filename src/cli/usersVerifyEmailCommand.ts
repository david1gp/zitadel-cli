import { VerifyEmailResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userVerifyEmailRequestParse } from "../v2/userVerifyEmailRequestParse.js"
import { userServiceVerifyEmail } from "../v2/userServiceVerifyEmail.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.VerifyEmail.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyEmail
 */
export const usersVerifyEmailCommand = endpointCommandBuild({
  call: userServiceVerifyEmail,
  docs: {
    brief: "Verify a user's email address with a verification code",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated VerifyEmail protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyEmail",
  },
  operation: "usersVerifyEmailCommandRun",
  requestName: "VerifyEmail",
  requestParse: userVerifyEmailRequestParse,
  responseSchema: VerifyEmailResponseSchema,
})

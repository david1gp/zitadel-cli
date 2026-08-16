import { RemoveOTPEmailResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRemoveOTPEmailRequestParse } from "../v2/userRemoveOTPEmailRequestParse.js"
import { userServiceRemoveOTPEmail } from "../v2/userServiceRemoveOTPEmail.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.RemoveOTPEmail.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveOTPEmail
 */
export const usersRemoveOTPEmailCommand = endpointCommandBuild({
  call: userServiceRemoveOTPEmail,
  docs: {
    brief: "Remove a user's OTP email factor",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RemoveOTPEmail protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveOTPEmail",
  },
  operation: "usersRemoveOTPEmailCommandRun",
  requestName: "RemoveOTPEmail",
  requestParse: userRemoveOTPEmailRequestParse,
  responseSchema: RemoveOTPEmailResponseSchema,
})

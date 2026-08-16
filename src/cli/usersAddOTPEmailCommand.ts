import { AddOTPEmailResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userAddOTPEmailRequestParse } from "../v2/userAddOTPEmailRequestParse.js"
import { userServiceAddOTPEmail } from "../v2/userServiceAddOTPEmail.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.AddOTPEmail.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddOTPEmail
 */
export const usersAddOTPEmailCommand = endpointCommandBuild({
  call: userServiceAddOTPEmail,
  docs: {
    brief: "Add an OTP email factor to a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated AddOTPEmail protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddOTPEmail",
  },
  operation: "usersAddOTPEmailCommandRun",
  requestName: "AddOTPEmail",
  requestParse: userAddOTPEmailRequestParse,
  responseSchema: AddOTPEmailResponseSchema,
})

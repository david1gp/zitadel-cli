import { ResendPhoneCodeResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userResendPhoneCodeRequestParse } from "../v2/userResendPhoneCodeRequestParse.js"
import { userServiceResendPhoneCode } from "../v2/userServiceResendPhoneCode.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.ResendPhoneCode.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ResendPhoneCode
 */
export const usersResendPhoneCodeCommand = endpointCommandBuild({
  call: userServiceResendPhoneCode,
  docs: {
    brief: "Resend a phone verification code for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ResendPhoneCode protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ResendPhoneCode",
  },
  operation: "usersResendPhoneCodeCommandRun",
  requestName: "ResendPhoneCode",
  requestParse: userResendPhoneCodeRequestParse,
  responseSchema: ResendPhoneCodeResponseSchema,
})

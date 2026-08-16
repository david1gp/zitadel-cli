import { ResendEmailCodeResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userResendEmailCodeRequestParse } from "../v2/userResendEmailCodeRequestParse.js"
import { userServiceResendEmailCode } from "../v2/userServiceResendEmailCode.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.ResendEmailCode.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ResendEmailCode
 */
export const usersResendEmailCodeCommand = endpointCommandBuild({
  call: userServiceResendEmailCode,
  docs: {
    brief: "Resend a code to verify a user's email address",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ResendEmailCode protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ResendEmailCode",
  },
  operation: "usersResendEmailCodeCommandRun",
  requestName: "ResendEmailCode",
  requestParse: userResendEmailCodeRequestParse,
  responseSchema: ResendEmailCodeResponseSchema,
})

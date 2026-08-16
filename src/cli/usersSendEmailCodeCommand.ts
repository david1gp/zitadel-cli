import { SendEmailCodeResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userSendEmailCodeRequestParse } from "../v2/userSendEmailCodeRequestParse.js"
import { userServiceSendEmailCode } from "../v2/userServiceSendEmailCode.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.SendEmailCode.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.SendEmailCode
 */
export const usersSendEmailCodeCommand = endpointCommandBuild({
  call: userServiceSendEmailCode,
  docs: {
    brief: "Send a code to verify a user's email address",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated SendEmailCode protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.SendEmailCode",
  },
  operation: "usersSendEmailCodeCommandRun",
  requestName: "SendEmailCode",
  requestParse: userSendEmailCodeRequestParse,
  responseSchema: SendEmailCodeResponseSchema,
})

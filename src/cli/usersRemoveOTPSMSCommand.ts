import { RemoveOTPSMSResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRemoveOTPSMSRequestParse } from "../v2/userRemoveOTPSMSRequestParse.js"
import { userServiceRemoveOTPSMS } from "../v2/userServiceRemoveOTPSMS.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.RemoveOTPSMS.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveOTPSMS
 */
export const usersRemoveOTPSMSCommand = endpointCommandBuild({
  call: userServiceRemoveOTPSMS,
  docs: {
    brief: "Remove a user's SMS-based OTP factor",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RemoveOTPSMS protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveOTPSMS",
  },
  operation: "usersRemoveOTPSMSCommandRun",
  requestName: "RemoveOTPSMS",
  requestParse: userRemoveOTPSMSRequestParse,
  responseSchema: RemoveOTPSMSResponseSchema,
})

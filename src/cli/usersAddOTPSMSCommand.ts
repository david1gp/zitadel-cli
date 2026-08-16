import { AddOTPSMSResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userAddOTPSMSRequestParse } from "../v2/userAddOTPSMSRequestParse.js"
import { userServiceAddOTPSMS } from "../v2/userServiceAddOTPSMS.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.AddOTPSMS.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddOTPSMS
 */
export const usersAddOTPSMSCommand = endpointCommandBuild({
  call: userServiceAddOTPSMS,
  docs: {
    brief: "Add SMS-based OTP authentication for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated AddOTPSMS protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddOTPSMS",
  },
  operation: "usersAddOTPSMSCommandRun",
  requestName: "AddOTPSMS",
  requestParse: userAddOTPSMSRequestParse,
  responseSchema: AddOTPSMSResponseSchema,
})

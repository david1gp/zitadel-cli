import { RemoveTOTPResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRemoveTOTPRequestParse } from "../v2/userRemoveTOTPRequestParse.js"
import { userServiceRemoveTOTP } from "../v2/userServiceRemoveTOTP.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.RemoveTOTP.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveTOTP
 */
export const usersRemoveTOTPCommand = endpointCommandBuild({
  call: userServiceRemoveTOTP,
  docs: {
    brief: "Remove the TOTP generator from a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RemoveTOTP protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveTOTP",
  },
  operation: "usersRemoveTOTPCommandRun",
  requestName: "RemoveTOTP",
  requestParse: userRemoveTOTPRequestParse,
  responseSchema: RemoveTOTPResponseSchema,
})

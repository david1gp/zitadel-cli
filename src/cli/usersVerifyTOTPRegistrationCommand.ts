import { VerifyTOTPRegistrationResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userServiceVerifyTOTPRegistration } from "../v2/userServiceVerifyTOTPRegistration.js"
import { userVerifyTOTPRegistrationRequestParse } from "../v2/userVerifyTOTPRegistrationRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.VerifyTOTPRegistration.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyTOTPRegistration
 */
export const usersVerifyTOTPRegistrationCommand = endpointCommandBuild({
  call: userServiceVerifyTOTPRegistration,
  docs: {
    brief: "Verify a user's TOTP registration with a code",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated VerifyTOTPRegistration protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyTOTPRegistration",
  },
  operation: "usersVerifyTOTPRegistrationCommandRun",
  requestName: "VerifyTOTPRegistration",
  requestParse: userVerifyTOTPRegistrationRequestParse,
  responseSchema: VerifyTOTPRegistrationResponseSchema,
})

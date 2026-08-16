import { VerifyPasskeyRegistrationResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userServiceVerifyPasskeyRegistration } from "../v2/userServiceVerifyPasskeyRegistration.js"
import { userVerifyPasskeyRegistrationRequestParse } from "../v2/userVerifyPasskeyRegistrationRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.VerifyPasskeyRegistration.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyPasskeyRegistration
 */
export const usersVerifyPasskeyRegistrationCommand = endpointCommandBuild({
  call: userServiceVerifyPasskeyRegistration,
  docs: {
    brief: "Verify a passkey registration for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated VerifyPasskeyRegistration protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyPasskeyRegistration",
  },
  operation: "usersVerifyPasskeyRegistrationCommandRun",
  requestName: "VerifyPasskeyRegistration",
  requestParse: userVerifyPasskeyRegistrationRequestParse,
  responseSchema: VerifyPasskeyRegistrationResponseSchema,
})

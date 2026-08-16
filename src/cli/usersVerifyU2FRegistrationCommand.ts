import { VerifyU2FRegistrationResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userServiceVerifyU2FRegistration } from "../v2/userServiceVerifyU2FRegistration.js"
import { userVerifyU2FRegistrationRequestParse } from "../v2/userVerifyU2FRegistrationRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.VerifyU2FRegistration.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyU2FRegistration
 */
export const usersVerifyU2FRegistrationCommand = endpointCommandBuild({
  call: userServiceVerifyU2FRegistration,
  docs: {
    brief: "Verify a U2F registration for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated VerifyU2FRegistration protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyU2FRegistration",
  },
  operation: "usersVerifyU2FRegistrationCommandRun",
  requestName: "VerifyU2FRegistration",
  requestParse: userVerifyU2FRegistrationRequestParse,
  responseSchema: VerifyU2FRegistrationResponseSchema,
})

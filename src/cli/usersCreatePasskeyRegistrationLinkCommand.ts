import { CreatePasskeyRegistrationLinkResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userCreatePasskeyRegistrationLinkRequestParse } from "../v2/userCreatePasskeyRegistrationLinkRequestParse.js"
import { userServiceCreatePasskeyRegistrationLink } from "../v2/userServiceCreatePasskeyRegistrationLink.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.CreatePasskeyRegistrationLink.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreatePasskeyRegistrationLink
 */
export const usersCreatePasskeyRegistrationLinkCommand = endpointCommandBuild({
  call: userServiceCreatePasskeyRegistrationLink,
  docs: {
    brief: "Create a passkey registration link or return a registration code",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated CreatePasskeyRegistrationLink protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreatePasskeyRegistrationLink",
  },
  operation: "usersCreatePasskeyRegistrationLinkCommandRun",
  requestName: "CreatePasskeyRegistrationLink",
  requestParse: userCreatePasskeyRegistrationLinkRequestParse,
  responseSchema: CreatePasskeyRegistrationLinkResponseSchema,
})

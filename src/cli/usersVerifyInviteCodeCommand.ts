import { VerifyInviteCodeResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userServiceVerifyInviteCode } from "../v2/userServiceVerifyInviteCode.js"
import { userVerifyInviteCodeRequestParse } from "../v2/userVerifyInviteCodeRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.VerifyInviteCode.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyInviteCode
 */
export const usersVerifyInviteCodeCommand = endpointCommandBuild({
  call: userServiceVerifyInviteCode,
  docs: {
    brief: "Verify a user's invite code",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated VerifyInviteCode protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyInviteCode",
  },
  operation: "usersVerifyInviteCodeCommandRun",
  requestName: "VerifyInviteCode",
  requestParse: userVerifyInviteCodeRequestParse,
  responseSchema: VerifyInviteCodeResponseSchema,
})

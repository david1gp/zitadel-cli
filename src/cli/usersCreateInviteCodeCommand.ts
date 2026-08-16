import { CreateInviteCodeResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userCreateInviteCodeRequestParse } from "../v2/userCreateInviteCodeRequestParse.js"
import { userServiceCreateInviteCode } from "../v2/userServiceCreateInviteCode.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.CreateInviteCode.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreateInviteCode
 */
export const usersCreateInviteCodeCommand = endpointCommandBuild({
  call: userServiceCreateInviteCode,
  docs: {
    brief: "Create an invite code for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated CreateInviteCode protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreateInviteCode",
  },
  operation: "usersCreateInviteCodeCommandRun",
  requestName: "CreateInviteCode",
  requestParse: userCreateInviteCodeRequestParse,
  responseSchema: CreateInviteCodeResponseSchema,
})

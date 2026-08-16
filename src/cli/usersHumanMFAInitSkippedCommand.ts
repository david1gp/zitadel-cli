import { HumanMFAInitSkippedResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userHumanMFAInitSkippedRequestParse } from "../v2/userHumanMFAInitSkippedRequestParse.js"
import { userServiceHumanMFAInitSkipped } from "../v2/userServiceHumanMFAInitSkipped.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.HumanMFAInitSkipped.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.HumanMFAInitSkipped
 */
export const usersHumanMFAInitSkippedCommand = endpointCommandBuild({
  call: userServiceHumanMFAInitSkipped,
  docs: {
    brief: "Mark a user's initial human MFA setup as skipped",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated HumanMFAInitSkipped protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.HumanMFAInitSkipped",
  },
  operation: "usersHumanMFAInitSkippedCommandRun",
  requestName: "HumanMFAInitSkipped",
  requestParse: userHumanMFAInitSkippedRequestParse,
  responseSchema: HumanMFAInitSkippedResponseSchema,
})

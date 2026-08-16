import { RemoveU2FResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRemoveU2FRequestParse } from "../v2/userRemoveU2FRequestParse.js"
import { userServiceRemoveU2F } from "../v2/userServiceRemoveU2F.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.RemoveU2F.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveU2F
 */
export const usersRemoveU2FCommand = endpointCommandBuild({
  call: userServiceRemoveU2F,
  docs: {
    brief: "Remove a U2F authenticator for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RemoveU2F protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveU2F",
  },
  operation: "usersRemoveU2FCommandRun",
  requestName: "RemoveU2F",
  requestParse: userRemoveU2FRequestParse,
  responseSchema: RemoveU2FResponseSchema,
})

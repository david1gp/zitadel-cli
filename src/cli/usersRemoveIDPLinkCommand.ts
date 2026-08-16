import { RemoveIDPLinkResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRemoveIDPLinkRequestParse } from "../v2/userRemoveIDPLinkRequestParse.js"
import { userServiceRemoveIDPLink } from "../v2/userServiceRemoveIDPLink.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.RemoveIDPLink.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveIDPLink
 */
export const usersRemoveIDPLinkCommand = endpointCommandBuild({
  call: userServiceRemoveIDPLink,
  docs: {
    brief: "Remove an identity provider link from a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RemoveIDPLink protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveIDPLink",
  },
  operation: "usersRemoveIDPLinkCommandRun",
  requestName: "RemoveIDPLink",
  requestParse: userRemoveIDPLinkRequestParse,
  responseSchema: RemoveIDPLinkResponseSchema,
})

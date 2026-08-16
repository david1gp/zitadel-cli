import { ListIDPLinksResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userListIDPLinksRequestParse } from "../v2/userListIDPLinksRequestParse.js"
import { userServiceListIDPLinks } from "../v2/userServiceListIDPLinks.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.ListIDPLinks.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListIDPLinks
 */
export const usersListIDPLinksCommand = endpointCommandBuild({
  call: userServiceListIDPLinks,
  docs: {
    brief: "List identity provider links for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListIDPLinks protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListIDPLinks",
  },
  operation: "usersListIDPLinksCommandRun",
  requestName: "ListIDPLinks",
  requestParse: userListIDPLinksRequestParse,
  responseSchema: ListIDPLinksResponseSchema,
})

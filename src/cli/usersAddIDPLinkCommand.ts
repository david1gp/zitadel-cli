import { AddIDPLinkResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userAddIDPLinkRequestParse } from "../v2/userAddIDPLinkRequestParse.js"
import { userServiceAddIDPLink } from "../v2/userServiceAddIDPLink.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.AddIDPLink.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddIDPLink
 */
export const usersAddIDPLinkCommand = endpointCommandBuild({
  call: userServiceAddIDPLink,
  docs: {
    brief: "Add an identity provider link to a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated AddIDPLink protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddIDPLink",
  },
  operation: "usersAddIDPLinkCommandRun",
  requestName: "AddIDPLink",
  requestParse: userAddIDPLinkRequestParse,
  responseSchema: AddIDPLinkResponseSchema,
})

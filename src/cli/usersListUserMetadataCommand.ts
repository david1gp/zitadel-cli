import { ListUserMetadataResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userListUserMetadataRequestParse } from "../v2/userListUserMetadataRequestParse.js"
import { userServiceListUserMetadata } from "../v2/userServiceListUserMetadata.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.ListUserMetadata.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListUserMetadata
 */
export const usersListUserMetadataCommand = endpointCommandBuild({
  call: userServiceListUserMetadata,
  docs: {
    brief: "List metadata stored for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListUserMetadata protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListUserMetadata",
  },
  operation: "usersListUserMetadataCommandRun",
  requestName: "ListUserMetadata",
  requestParse: userListUserMetadataRequestParse,
  responseSchema: ListUserMetadataResponseSchema,
})

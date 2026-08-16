import { DeleteUserMetadataResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userDeleteUserMetadataRequestParse } from "../v2/userDeleteUserMetadataRequestParse.js"
import { userServiceDeleteUserMetadata } from "../v2/userServiceDeleteUserMetadata.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.DeleteUserMetadata.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.DeleteUserMetadata
 */
export const usersDeleteUserMetadataCommand = endpointCommandBuild({
  call: userServiceDeleteUserMetadata,
  docs: {
    brief: "Delete selected metadata entries from a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeleteUserMetadata protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.DeleteUserMetadata",
  },
  operation: "usersDeleteUserMetadataCommandRun",
  requestName: "DeleteUserMetadata",
  requestParse: userDeleteUserMetadataRequestParse,
  responseSchema: DeleteUserMetadataResponseSchema,
})

import { SetUserMetadataResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userServiceSetUserMetadata } from "../v2/userServiceSetUserMetadata.js"
import { userSetUserMetadataRequestParse } from "../v2/userSetUserMetadataRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.SetUserMetadata.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.SetUserMetadata
 */
export const usersSetUserMetadataCommand = endpointCommandBuild({
  call: userServiceSetUserMetadata,
  docs: {
    brief: "Set user metadata for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated SetUserMetadata protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.SetUserMetadata",
  },
  operation: "usersSetUserMetadataCommandRun",
  requestName: "SetUserMetadata",
  requestParse: userSetUserMetadataRequestParse,
  responseSchema: SetUserMetadataResponseSchema,
})

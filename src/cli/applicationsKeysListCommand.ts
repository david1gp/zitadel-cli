import { ListApplicationKeysResponseSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { applicationListApplicationKeysRequestParse } from "../v2/applicationListApplicationKeysRequestParse.js"
import { applicationServiceListApplicationKeys } from "../v2/applicationServiceListApplicationKeys.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ApplicationService.ListApplicationKeys.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.ListApplicationKeys
 */
export const applicationsKeysListCommand = endpointCommandBuild({
  call: applicationServiceListApplicationKeys,
  docs: {
    brief: "List application keys visible to the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListApplicationKeys protobuf JSON shape.",
  },
  operation: "applicationsKeysListCommandRun",
  requestName: "ListApplicationKeys",
  requestParse: applicationListApplicationKeysRequestParse,
  responseSchema: ListApplicationKeysResponseSchema,
})

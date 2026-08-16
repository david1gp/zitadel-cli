import { GetApplicationKeyResponseSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { applicationGetApplicationKeyRequestParse } from "../v2/applicationGetApplicationKeyRequestParse.js"
import { applicationServiceGetApplicationKey } from "../v2/applicationServiceGetApplicationKey.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ApplicationService.GetApplicationKey.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.GetApplicationKey
 */
export const applicationsGetApplicationKeyCommand = endpointCommandBuild({
  call: applicationServiceGetApplicationKey,
  docs: {
    brief: "Get an application key by ID",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated GetApplicationKey protobuf JSON shape.",
  },
  operation: "applicationsGetApplicationKeyCommandRun",
  requestName: "GetApplicationKey",
  requestParse: applicationGetApplicationKeyRequestParse,
  responseSchema: GetApplicationKeyResponseSchema,
})

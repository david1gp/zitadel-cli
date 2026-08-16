import { DeleteApplicationKeyResponseSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { applicationDeleteApplicationKeyRequestParse } from "../v2/applicationDeleteApplicationKeyRequestParse.js"
import { applicationServiceDeleteApplicationKey } from "../v2/applicationServiceDeleteApplicationKey.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ApplicationService.DeleteApplicationKey.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.DeleteApplicationKey
 */
export const applicationsDeleteApplicationKeyCommand = endpointCommandBuild({
  call: applicationServiceDeleteApplicationKey,
  docs: {
    brief: "Delete an application key for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeleteApplicationKey protobuf JSON shape.",
  },
  operation: "applicationsDeleteApplicationKeyCommandRun",
  requestName: "DeleteApplicationKey",
  requestParse: applicationDeleteApplicationKeyRequestParse,
  responseSchema: DeleteApplicationKeyResponseSchema,
})

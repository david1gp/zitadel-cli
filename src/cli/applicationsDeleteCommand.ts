import { DeleteApplicationResponseSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { applicationDeleteApplicationRequestParse } from "../v2/applicationDeleteApplicationRequestParse.js"
import { applicationServiceDeleteApplication } from "../v2/applicationServiceDeleteApplication.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ApplicationService.DeleteApplication.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.DeleteApplication
 */
export const applicationsDeleteCommand = endpointCommandBuild({
  call: applicationServiceDeleteApplication,
  docs: {
    brief: "Delete an application for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeleteApplication protobuf JSON shape.",
  },
  operation: "applicationsDeleteCommandRun",
  requestName: "DeleteApplication",
  requestParse: applicationDeleteApplicationRequestParse,
  responseSchema: DeleteApplicationResponseSchema,
})

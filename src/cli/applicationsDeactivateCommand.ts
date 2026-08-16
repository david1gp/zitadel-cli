import { DeactivateApplicationResponseSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { applicationDeactivateApplicationRequestParse } from "../v2/applicationDeactivateApplicationRequestParse.js"
import { applicationServiceDeactivateApplication } from "../v2/applicationServiceDeactivateApplication.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ApplicationService.DeactivateApplication.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.DeactivateApplication
 */
export const applicationsDeactivateCommand = endpointCommandBuild({
  call: applicationServiceDeactivateApplication,
  docs: {
    brief: "Deactivate an application for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeactivateApplication protobuf JSON shape.",
  },
  operation: "applicationsDeactivateCommandRun",
  requestName: "DeactivateApplication",
  requestParse: applicationDeactivateApplicationRequestParse,
  responseSchema: DeactivateApplicationResponseSchema,
})

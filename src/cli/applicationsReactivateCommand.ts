import { ReactivateApplicationResponseSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { applicationReactivateApplicationRequestParse } from "../v2/applicationReactivateApplicationRequestParse.js"
import { applicationServiceReactivateApplication } from "../v2/applicationServiceReactivateApplication.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ApplicationService.ReactivateApplication.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.ReactivateApplication
 */
export const applicationsReactivateCommand = endpointCommandBuild({
  call: applicationServiceReactivateApplication,
  docs: {
    brief: "Reactivate an application for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ReactivateApplication protobuf JSON shape.",
  },
  operation: "applicationsReactivateCommandRun",
  requestName: "ReactivateApplication",
  requestParse: applicationReactivateApplicationRequestParse,
  responseSchema: ReactivateApplicationResponseSchema,
})

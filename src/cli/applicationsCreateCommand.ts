import { CreateApplicationResponseSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { applicationCreateApplicationRequestParse } from "../v2/applicationCreateApplicationRequestParse.js"
import { applicationServiceCreateApplication } from "../v2/applicationServiceCreateApplication.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ApplicationService.CreateApplication.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.CreateApplication
 */
export const applicationsCreateCommand = endpointCommandBuild({
  call: applicationServiceCreateApplication,
  docs: {
    brief: "Create an application for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated CreateApplication protobuf JSON shape.",
  },
  operation: "applicationsCreateCommandRun",
  requestName: "CreateApplication",
  requestParse: applicationCreateApplicationRequestParse,
  responseSchema: CreateApplicationResponseSchema,
})

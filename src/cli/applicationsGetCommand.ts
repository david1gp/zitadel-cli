import { GetApplicationResponseSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { applicationGetApplicationRequestParse } from "../v2/applicationGetApplicationRequestParse.js"
import { applicationServiceGetApplication } from "../v2/applicationServiceGetApplication.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ApplicationService.GetApplication.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.GetApplication
 */
export const applicationsGetCommand = endpointCommandBuild({
  call: applicationServiceGetApplication,
  docs: {
    brief: "Get an application by ID",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated GetApplication protobuf JSON shape.",
  },
  operation: "applicationsGetCommandRun",
  requestName: "GetApplication",
  requestParse: applicationGetApplicationRequestParse,
  responseSchema: GetApplicationResponseSchema,
})

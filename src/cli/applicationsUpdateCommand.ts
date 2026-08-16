import { UpdateApplicationResponseSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { applicationServiceUpdateApplication } from "../v2/applicationServiceUpdateApplication.js"
import { applicationUpdateApplicationRequestParse } from "../v2/applicationUpdateApplicationRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ApplicationService.UpdateApplication.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.UpdateApplication
 */
export const applicationsUpdateCommand = endpointCommandBuild({
  call: applicationServiceUpdateApplication,
  docs: {
    brief: "Update an application for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated UpdateApplication protobuf JSON shape.",
  },
  operation: "applicationsUpdateCommandRun",
  requestName: "UpdateApplication",
  requestParse: applicationUpdateApplicationRequestParse,
  responseSchema: UpdateApplicationResponseSchema,
})

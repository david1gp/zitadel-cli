import { ListApplicationsResponseSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { applicationListApplicationsRequestParse } from "../v2/applicationListApplicationsRequestParse.js"
import { applicationServiceListApplications } from "../v2/applicationServiceListApplications.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ApplicationService.ListApplications.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.ListApplications
 */
export const applicationsListCommand = endpointCommandBuild({
  call: applicationServiceListApplications,
  docs: {
    brief: "List applications visible to the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListApplications protobuf JSON shape.",
  },
  operation: "applicationsListCommandRun",
  requestName: "ListApplications",
  requestParse: applicationListApplicationsRequestParse,
  responseSchema: ListApplicationsResponseSchema,
})

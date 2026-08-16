import { ListProjectGrantsResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectListProjectGrantsRequestParse } from "../v2/projectListProjectGrantsRequestParse.js"
import { projectServiceListProjectGrants } from "../v2/projectServiceListProjectGrants.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.ListProjectGrants.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ListProjectGrants
 */
export const projectsListProjectGrantsCommand = endpointCommandBuild({
  call: projectServiceListProjectGrants,
  docs: {
    brief: "List project grants visible to the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListProjectGrants protobuf JSON shape.",
  },
  operation: "projectsListProjectGrantsCommandRun",
  requestName: "ListProjectGrants",
  requestParse: projectListProjectGrantsRequestParse,
  responseSchema: ListProjectGrantsResponseSchema,
})

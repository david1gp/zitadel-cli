import { ListProjectRolesResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectListProjectRolesRequestParse } from "../v2/projectListProjectRolesRequestParse.js"
import { projectServiceListProjectRoles } from "../v2/projectServiceListProjectRoles.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.ListProjectRoles.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ListProjectRoles
 */
export const projectsRolesListCommand = endpointCommandBuild({
  call: projectServiceListProjectRoles,
  docs: {
    brief: "List project roles visible to the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListProjectRoles protobuf JSON shape.",
  },
  operation: "projectsRolesListCommandRun",
  requestName: "ListProjectRoles",
  requestParse: projectListProjectRolesRequestParse,
  responseSchema: ListProjectRolesResponseSchema,
})

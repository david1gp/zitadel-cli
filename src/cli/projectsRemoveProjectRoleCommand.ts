import { RemoveProjectRoleResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectRemoveProjectRoleRequestParse } from "../v2/projectRemoveProjectRoleRequestParse.js"
import { projectServiceRemoveProjectRole } from "../v2/projectServiceRemoveProjectRole.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.RemoveProjectRole.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.RemoveProjectRole
 */
export const projectsRemoveProjectRoleCommand = endpointCommandBuild({
  call: projectServiceRemoveProjectRole,
  docs: {
    brief: "Remove a role from a project",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RemoveProjectRole protobuf JSON shape.",
  },
  operation: "projectsRemoveProjectRoleCommandRun",
  requestName: "RemoveProjectRole",
  requestParse: projectRemoveProjectRoleRequestParse,
  responseSchema: RemoveProjectRoleResponseSchema,
})

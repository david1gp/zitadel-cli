import { UpdateProjectRoleResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectServiceUpdateProjectRole } from "../v2/projectServiceUpdateProjectRole.js"
import { projectUpdateProjectRoleRequestParse } from "../v2/projectUpdateProjectRoleRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.UpdateProjectRole.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.UpdateProjectRole
 */
export const projectsRolesUpdateCommand = endpointCommandBuild({
  call: projectServiceUpdateProjectRole,
  docs: {
    brief: "Update a project role for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated UpdateProjectRole protobuf JSON shape.",
  },
  operation: "projectsRolesUpdateCommandRun",
  requestName: "UpdateProjectRole",
  requestParse: projectUpdateProjectRoleRequestParse,
  responseSchema: UpdateProjectRoleResponseSchema,
})

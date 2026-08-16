import { AddProjectRoleResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectAddProjectRoleRequestParse } from "../v2/projectAddProjectRoleRequestParse.js"
import { projectServiceAddProjectRole } from "../v2/projectServiceAddProjectRole.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.AddProjectRole.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.AddProjectRole
 */
export const projectsAddRoleCommand = endpointCommandBuild({
  call: projectServiceAddProjectRole,
  docs: {
    brief: "Add a role to a project for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated AddProjectRole protobuf JSON shape.",
  },
  operation: "projectsAddRoleCommandRun",
  requestName: "AddProjectRole",
  requestParse: projectAddProjectRoleRequestParse,
  responseSchema: AddProjectRoleResponseSchema,
})

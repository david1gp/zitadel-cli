import { DeactivateProjectResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectDeactivateProjectRequestParse } from "../v2/projectDeactivateProjectRequestParse.js"
import { projectServiceDeactivateProject } from "../v2/projectServiceDeactivateProject.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.DeactivateProject.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.DeactivateProject
 */
export const projectsDeactivateCommand = endpointCommandBuild({
  call: projectServiceDeactivateProject,
  docs: {
    brief: "Deactivate a project for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeactivateProject protobuf JSON shape.",
  },
  operation: "projectsDeactivateCommandRun",
  requestName: "DeactivateProject",
  requestParse: projectDeactivateProjectRequestParse,
  responseSchema: DeactivateProjectResponseSchema,
})

import { DeleteProjectResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectDeleteProjectRequestParse } from "../v2/projectDeleteProjectRequestParse.js"
import { projectServiceDeleteProject } from "../v2/projectServiceDeleteProject.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.DeleteProject.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.DeleteProject
 */
export const projectsDeleteCommand = endpointCommandBuild({
  call: projectServiceDeleteProject,
  docs: {
    brief: "Delete a project for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeleteProject protobuf JSON shape.",
  },
  operation: "projectsDeleteCommandRun",
  requestName: "DeleteProject",
  requestParse: projectDeleteProjectRequestParse,
  responseSchema: DeleteProjectResponseSchema,
})

import { UpdateProjectResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectServiceUpdateProject } from "../v2/projectServiceUpdateProject.js"
import { projectUpdateProjectRequestParse } from "../v2/projectUpdateProjectRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.UpdateProject.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.UpdateProject
 */
export const projectsUpdateCommand = endpointCommandBuild({
  call: projectServiceUpdateProject,
  docs: {
    brief: "Update a project for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated UpdateProject protobuf JSON shape.",
  },
  operation: "projectsUpdateCommandRun",
  requestName: "UpdateProject",
  requestParse: projectUpdateProjectRequestParse,
  responseSchema: UpdateProjectResponseSchema,
})

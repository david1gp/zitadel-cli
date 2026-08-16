import { GetProjectResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectGetProjectRequestParse } from "../v2/projectGetProjectRequestParse.js"
import { projectServiceGetProject } from "../v2/projectServiceGetProject.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.GetProject.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.GetProject
 */
export const projectsGetCommand = endpointCommandBuild({
  call: projectServiceGetProject,
  docs: {
    brief: "Get a project by ID",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated GetProject protobuf JSON shape.",
  },
  operation: "projectsGetCommandRun",
  requestName: "GetProject",
  requestParse: projectGetProjectRequestParse,
  responseSchema: GetProjectResponseSchema,
})

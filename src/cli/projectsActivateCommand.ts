import { ActivateProjectResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectActivateProjectRequestParse } from "../v2/projectActivateProjectRequestParse.js"
import { projectServiceActivateProject } from "../v2/projectServiceActivateProject.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.ActivateProject.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ActivateProject
 */
export const projectsActivateCommand = endpointCommandBuild({
  call: projectServiceActivateProject,
  docs: {
    brief: "Activate a project for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ActivateProject protobuf JSON shape.",
  },
  operation: "projectsActivateCommandRun",
  requestName: "ActivateProject",
  requestParse: projectActivateProjectRequestParse,
  responseSchema: ActivateProjectResponseSchema,
})

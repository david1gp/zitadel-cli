import { CreateProjectResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectCreateProjectRequestParse } from "../v2/projectCreateProjectRequestParse.js"
import { projectServiceCreateProject } from "../v2/projectServiceCreateProject.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.CreateProject.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.CreateProject
 */
export const projectsCreateCommand = endpointCommandBuild({
  call: projectServiceCreateProject,
  docs: {
    brief: "Create a project for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated CreateProject protobuf JSON shape.",
  },
  operation: "projectsCreateCommandRun",
  requestName: "CreateProject",
  requestParse: projectCreateProjectRequestParse,
  responseSchema: CreateProjectResponseSchema,
})

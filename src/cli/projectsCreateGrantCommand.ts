import { CreateProjectGrantResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectCreateProjectGrantRequestParse } from "../v2/projectCreateProjectGrantRequestParse.js"
import { projectServiceCreateProjectGrant } from "../v2/projectServiceCreateProjectGrant.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.CreateProjectGrant.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.CreateProjectGrant
 */
export const projectsCreateGrantCommand = endpointCommandBuild({
  call: projectServiceCreateProjectGrant,
  docs: {
    brief: "Grant a project to another organization",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated CreateProjectGrant protobuf JSON shape.",
  },
  operation: "projectsCreateGrantCommandRun",
  requestName: "CreateProjectGrant",
  requestParse: projectCreateProjectGrantRequestParse,
  responseSchema: CreateProjectGrantResponseSchema,
})

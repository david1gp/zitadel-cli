import { UpdateProjectGrantResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectServiceUpdateProjectGrant } from "../v2/projectServiceUpdateProjectGrant.js"
import { projectUpdateProjectGrantRequestParse } from "../v2/projectUpdateProjectGrantRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.UpdateProjectGrant.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.UpdateProjectGrant
 */
export const projectsUpdateProjectGrantCommand = endpointCommandBuild({
  call: projectServiceUpdateProjectGrant,
  docs: {
    brief: "Update the roles of a project grant",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated UpdateProjectGrant protobuf JSON shape. roleKeys replaces the complete set of roles on the project grant.",
  },
  operation: "projectsUpdateProjectGrantCommandRun",
  requestName: "UpdateProjectGrant",
  requestParse: projectUpdateProjectGrantRequestParse,
  responseSchema: UpdateProjectGrantResponseSchema,
})

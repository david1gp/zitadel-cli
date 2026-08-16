import { DeleteProjectGrantResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectDeleteProjectGrantRequestParse } from "../v2/projectDeleteProjectGrantRequestParse.js"
import { projectServiceDeleteProjectGrant } from "../v2/projectServiceDeleteProjectGrant.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.DeleteProjectGrant.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.DeleteProjectGrant
 */
export const projectsDeleteProjectGrantCommand = endpointCommandBuild({
  call: projectServiceDeleteProjectGrant,
  docs: {
    brief: "Delete a project grant for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeleteProjectGrant protobuf JSON shape.",
  },
  operation: "projectsDeleteProjectGrantCommandRun",
  requestName: "DeleteProjectGrant",
  requestParse: projectDeleteProjectGrantRequestParse,
  responseSchema: DeleteProjectGrantResponseSchema,
})

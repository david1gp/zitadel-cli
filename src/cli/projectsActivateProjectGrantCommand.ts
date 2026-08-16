import { ActivateProjectGrantResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectActivateProjectGrantRequestParse } from "../v2/projectActivateProjectGrantRequestParse.js"
import { projectServiceActivateProjectGrant } from "../v2/projectServiceActivateProjectGrant.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.ActivateProjectGrant.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ActivateProjectGrant
 */
export const projectsActivateProjectGrantCommand = endpointCommandBuild({
  call: projectServiceActivateProjectGrant,
  docs: {
    brief: "Activate a project grant for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ActivateProjectGrant protobuf JSON shape.",
  },
  operation: "projectsActivateProjectGrantCommandRun",
  requestName: "ActivateProjectGrant",
  requestParse: projectActivateProjectGrantRequestParse,
  responseSchema: ActivateProjectGrantResponseSchema,
})

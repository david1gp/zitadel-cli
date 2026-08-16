import { DeactivateProjectGrantResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectDeactivateProjectGrantRequestParse } from "../v2/projectDeactivateProjectGrantRequestParse.js"
import { projectServiceDeactivateProjectGrant } from "../v2/projectServiceDeactivateProjectGrant.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ProjectService.DeactivateProjectGrant.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.DeactivateProjectGrant
 */
export const projectsDeactivateProjectGrantCommand = endpointCommandBuild({
  call: projectServiceDeactivateProjectGrant,
  docs: {
    brief: "Deactivate a project grant for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeactivateProjectGrant protobuf JSON shape.",
  },
  operation: "projectsDeactivateProjectGrantCommandRun",
  requestName: "DeactivateProjectGrant",
  requestParse: projectDeactivateProjectGrantRequestParse,
  responseSchema: DeactivateProjectGrantResponseSchema,
})

import { UpdateTargetResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionUpdateTargetRequestParse } from "../v2/actionUpdateTargetRequestParse.js"
import { actionServiceUpdateTarget } from "../v2/actionServiceUpdateTarget.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.UpdateTarget.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.UpdateTarget
 */
export const actionsTargetsUpdateCommand = endpointCommandBuild({
  call: actionServiceUpdateTarget,
  docs: {
    brief: "Update an action target for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated UpdateTarget protobuf JSON shape.",
  },
  operation: "actionsTargetsUpdateCommandRun",
  requestName: "UpdateTarget",
  requestParse: actionUpdateTargetRequestParse,
  responseSchema: UpdateTargetResponseSchema,
})

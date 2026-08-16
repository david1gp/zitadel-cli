import { DeleteTargetResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionDeleteTargetRequestParse } from "../v2/actionDeleteTargetRequestParse.js"
import { actionServiceDeleteTarget } from "../v2/actionServiceDeleteTarget.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.DeleteTarget.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.DeleteTarget
 */
export const actionsTargetsDeleteCommand = endpointCommandBuild({
  call: actionServiceDeleteTarget,
  docs: {
    brief: "Delete an action target for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeleteTarget protobuf JSON shape. See https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.DeleteTarget.",
  },
  operation: "actionsTargetsDeleteCommandRun",
  requestName: "DeleteTarget",
  requestParse: actionDeleteTargetRequestParse,
  responseSchema: DeleteTargetResponseSchema,
})

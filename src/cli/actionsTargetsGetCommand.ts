import { GetTargetResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionGetTargetRequestParse } from "../v2/actionGetTargetRequestParse.js"
import { actionServiceGetTarget } from "../v2/actionServiceGetTarget.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.GetTarget.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.GetTarget
 */
export const actionsTargetsGetCommand = endpointCommandBuild({
  call: actionServiceGetTarget,
  docs: {
    brief: "Get an action target by ID",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated GetTarget protobuf JSON shape.",
  },
  operation: "actionsTargetsGetCommandRun",
  requestName: "GetTarget",
  requestParse: actionGetTargetRequestParse,
  responseSchema: GetTargetResponseSchema,
})

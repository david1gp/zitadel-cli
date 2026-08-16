import { SetExecutionResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionSetExecutionRequestParse } from "../v2/actionSetExecutionRequestParse.js"
import { actionServiceSetExecution } from "../v2/actionServiceSetExecution.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.SetExecution.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.SetExecution
 */
export const actionsExecutionsSetCommand = endpointCommandBuild({
  call: actionServiceSetExecution,
  docs: {
    brief: "Set an action execution and its targets",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated SetExecution protobuf JSON shape.",
  },
  operation: "actionsExecutionsSetCommandRun",
  requestName: "SetExecution",
  requestParse: actionSetExecutionRequestParse,
  responseSchema: SetExecutionResponseSchema,
})

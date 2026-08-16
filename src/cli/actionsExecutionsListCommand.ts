import { ListExecutionsResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionListExecutionsRequestParse } from "../v2/actionListExecutionsRequestParse.js"
import { actionServiceListExecutions } from "../v2/actionServiceListExecutions.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.ListExecutions.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutions
 */
export const actionsExecutionsListCommand = endpointCommandBuild({
  call: actionServiceListExecutions,
  docs: {
    brief: "List action executions visible to the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListExecutions protobuf JSON shape.",
  },
  operation: "actionsExecutionsListCommandRun",
  requestName: "ListExecutions",
  requestParse: actionListExecutionsRequestParse,
  responseSchema: ListExecutionsResponseSchema,
})

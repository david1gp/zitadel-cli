import { ListExecutionFunctionsResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionListExecutionFunctionsRequestParse } from "../v2/actionListExecutionFunctionsRequestParse.js"
import { actionServiceListExecutionFunctions } from "../v2/actionServiceListExecutionFunctions.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.ListExecutionFunctions.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutionFunctions
 */
export const actionsExecutionFunctionsListCommand = endpointCommandBuild({
  call: actionServiceListExecutionFunctions,
  docs: {
    brief: "List functions available for action execution conditions",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListExecutionFunctions protobuf JSON shape.",
  },
  operation: "actionsExecutionFunctionsListCommandRun",
  requestName: "ListExecutionFunctions",
  requestParse: actionListExecutionFunctionsRequestParse,
  responseSchema: ListExecutionFunctionsResponseSchema,
})

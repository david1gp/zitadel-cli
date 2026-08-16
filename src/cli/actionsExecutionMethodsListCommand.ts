import { ListExecutionMethodsResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionListExecutionMethodsRequestParse } from "../v2/actionListExecutionMethodsRequestParse.js"
import { actionServiceListExecutionMethods } from "../v2/actionServiceListExecutionMethods.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.ListExecutionMethods.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutionMethods
 */
export const actionsExecutionMethodsListCommand = endpointCommandBuild({
  call: actionServiceListExecutionMethods,
  docs: {
    brief: "List action execution methods visible to the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListExecutionMethods protobuf JSON shape.",
  },
  operation: "actionsExecutionMethodsListCommandRun",
  requestName: "ListExecutionMethods",
  requestParse: actionListExecutionMethodsRequestParse,
  responseSchema: ListExecutionMethodsResponseSchema,
})

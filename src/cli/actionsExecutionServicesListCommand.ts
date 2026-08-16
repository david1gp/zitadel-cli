import { ListExecutionServicesResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionListExecutionServicesRequestParse } from "../v2/actionListExecutionServicesRequestParse.js"
import { actionServiceListExecutionServices } from "../v2/actionServiceListExecutionServices.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.ListExecutionServices.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutionServices
 */
export const actionsExecutionServicesListCommand = endpointCommandBuild({
  call: actionServiceListExecutionServices,
  docs: {
    brief: "List services available for action execution conditions",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListExecutionServices protobuf JSON shape.",
  },
  operation: "actionsExecutionServicesListCommandRun",
  requestName: "ListExecutionServices",
  requestParse: actionListExecutionServicesRequestParse,
  responseSchema: ListExecutionServicesResponseSchema,
})

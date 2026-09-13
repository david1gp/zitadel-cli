import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  ListExecutionFunctionsRequestSchema,
  type ListExecutionFunctionsResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceListExecutionFunctionsRequest = MessageInitShape<typeof ListExecutionFunctionsRequestSchema>

export type ActionServiceListExecutionFunctionsOptions = EndpointCallOptions & {
  readonly request?: ActionServiceListExecutionFunctionsRequest
}

/**
 * Lists all available functions which can be used as conditions for executions.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutionFunctions
 */
export async function actionServiceListExecutionFunctions(
  options: ActionServiceListExecutionFunctionsOptions = {},
): PromiseResult<ListExecutionFunctionsResponse> {
  const op = "actionServiceListExecutionFunctions"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listExecutionFunctions(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

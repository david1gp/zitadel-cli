import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  ListExecutionMethodsRequestSchema,
  type ListExecutionMethodsResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceListExecutionMethodsRequest = MessageInitShape<typeof ListExecutionMethodsRequestSchema>

export type ActionServiceListExecutionMethodsOptions = EndpointCallOptions & {
  readonly request?: ActionServiceListExecutionMethodsRequest
}

/**
 * Lists all available methods which can be used as conditions for executions.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutionMethods
 */
export async function actionServiceListExecutionMethods(
  options: ActionServiceListExecutionMethodsOptions = {},
): PromiseResult<ListExecutionMethodsResponse> {
  const op = "actionServiceListExecutionMethods"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listExecutionMethods(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

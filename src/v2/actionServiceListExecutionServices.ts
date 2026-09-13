import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  ListExecutionServicesRequestSchema,
  type ListExecutionServicesResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceListExecutionServicesRequest = MessageInitShape<typeof ListExecutionServicesRequestSchema>

export type ActionServiceListExecutionServicesOptions = EndpointCallOptions & {
  readonly request?: ActionServiceListExecutionServicesRequest
}

/**
 * Lists all services available for action execution conditions.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutionServices
 */
export async function actionServiceListExecutionServices(
  options: ActionServiceListExecutionServicesOptions = {},
): PromiseResult<ListExecutionServicesResponse> {
  const op = "actionServiceListExecutionServices"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listExecutionServices(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

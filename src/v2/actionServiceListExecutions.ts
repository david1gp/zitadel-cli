import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  ListExecutionsRequestSchema,
  type ListExecutionsResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceListExecutionsRequest = MessageInitShape<typeof ListExecutionsRequestSchema>

export type ActionServiceListExecutionsOptions = EndpointCallOptions & {
  readonly request?: ActionServiceListExecutionsRequest
}

/**
 * Lists all matching action executions.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutions
 */
export async function actionServiceListExecutions(
  options: ActionServiceListExecutionsOptions = {},
): PromiseResult<ListExecutionsResponse> {
  const op = "actionServiceListExecutions"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listExecutions(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

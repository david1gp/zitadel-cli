import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  SetExecutionRequestSchema,
  type SetExecutionResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceSetExecutionRequest = MessageInitShape<typeof SetExecutionRequestSchema>

export type ActionServiceSetExecutionOptions = EndpointCallOptions & {
  readonly request?: ActionServiceSetExecutionRequest
}

/**
 * Sets an action execution and its ordered targets.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.SetExecution
 */
export async function actionServiceSetExecution(
  options: ActionServiceSetExecutionOptions = {},
): PromiseResult<SetExecutionResponse> {
  const op = "actionServiceSetExecution"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.setExecution(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

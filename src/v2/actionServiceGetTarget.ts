import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  GetTargetRequestSchema,
  type GetTargetResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceGetTargetRequest = MessageInitShape<typeof GetTargetRequestSchema>

export type ActionServiceGetTargetOptions = EndpointCallOptions & {
  readonly request?: ActionServiceGetTargetRequest
}

/**
 * Gets an action target by ID.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.GetTarget
 */
export async function actionServiceGetTarget(
  options: ActionServiceGetTargetOptions = {},
): PromiseResult<GetTargetResponse> {
  const op = "actionServiceGetTarget"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.getTarget(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

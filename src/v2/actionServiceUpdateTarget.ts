import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  UpdateTargetRequestSchema,
  type UpdateTargetResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceUpdateTargetRequest = MessageInitShape<typeof UpdateTargetRequestSchema>

export type ActionServiceUpdateTargetOptions = EndpointCallOptions & {
  readonly request?: ActionServiceUpdateTargetRequest
}

/**
 * Updates an action target for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.UpdateTarget
 */
export async function actionServiceUpdateTarget(
  options: ActionServiceUpdateTargetOptions = {},
): PromiseResult<UpdateTargetResponse> {
  const op = "actionServiceUpdateTarget"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.updateTarget(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

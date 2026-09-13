import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  DeleteTargetRequestSchema,
  type DeleteTargetResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceDeleteTargetRequest = MessageInitShape<typeof DeleteTargetRequestSchema>

export type ActionServiceDeleteTargetOptions = EndpointCallOptions & {
  readonly request?: ActionServiceDeleteTargetRequest
}

/**
 * Deletes an existing action target for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.DeleteTarget
 */
export async function actionServiceDeleteTarget(
  options: ActionServiceDeleteTargetOptions = {},
): PromiseResult<DeleteTargetResponse> {
  const op = "actionServiceDeleteTarget"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deleteTarget(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

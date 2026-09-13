import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  CreateTargetRequestSchema,
  type CreateTargetResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceCreateTargetRequest = MessageInitShape<typeof CreateTargetRequestSchema>

export type ActionServiceCreateTargetOptions = EndpointCallOptions & {
  readonly request?: ActionServiceCreateTargetRequest
}

/**
 * Creates an action target for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.CreateTarget
 */
export async function actionServiceCreateTarget(
  options: ActionServiceCreateTargetOptions = {},
): PromiseResult<CreateTargetResponse> {
  const op = "actionServiceCreateTarget"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.createTarget(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

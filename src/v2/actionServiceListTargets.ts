import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  ListTargetsRequestSchema,
  type ListTargetsResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceListTargetsRequest = MessageInitShape<typeof ListTargetsRequestSchema>

export type ActionServiceListTargetsOptions = EndpointCallOptions & {
  readonly request?: ActionServiceListTargetsRequest
}

/**
 * Lists all matching action targets.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListTargets
 */
export async function actionServiceListTargets(
  options: ActionServiceListTargetsOptions = {},
): PromiseResult<ListTargetsResponse> {
  const op = "actionServiceListTargets"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listTargets(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

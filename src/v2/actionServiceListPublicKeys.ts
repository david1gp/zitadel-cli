import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  ListPublicKeysRequestSchema,
  type ListPublicKeysResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceListPublicKeysRequest = MessageInitShape<typeof ListPublicKeysRequestSchema>

export type ActionServiceListPublicKeysOptions = EndpointCallOptions & {
  readonly request?: ActionServiceListPublicKeysRequest
}

/**
 * Lists all public keys for an action target.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListPublicKeys
 */
export async function actionServiceListPublicKeys(
  options: ActionServiceListPublicKeysOptions = {},
): PromiseResult<ListPublicKeysResponse> {
  const op = "actionServiceListPublicKeys"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listPublicKeys(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

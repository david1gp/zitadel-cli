import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  RemovePublicKeyRequestSchema,
  type RemovePublicKeyResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceRemovePublicKeyRequest = MessageInitShape<typeof RemovePublicKeyRequestSchema>

export type ActionServiceRemovePublicKeyOptions = EndpointCallOptions & {
  readonly request?: ActionServiceRemovePublicKeyRequest
}

/**
 * Removes an inactive public key from an action target.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.RemovePublicKey
 */
export async function actionServiceRemovePublicKey(
  options: ActionServiceRemovePublicKeyOptions = {},
): PromiseResult<RemovePublicKeyResponse> {
  const op = "actionServiceRemovePublicKey"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.removePublicKey(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

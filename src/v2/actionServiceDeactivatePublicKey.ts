import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  DeactivatePublicKeyRequestSchema,
  type DeactivatePublicKeyResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceDeactivatePublicKeyRequest = MessageInitShape<typeof DeactivatePublicKeyRequestSchema>

export type ActionServiceDeactivatePublicKeyOptions = EndpointCallOptions & {
  readonly request?: ActionServiceDeactivatePublicKeyRequest
}

/**
 * Deactivates a public key for an action target.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.DeactivatePublicKey
 */
export async function actionServiceDeactivatePublicKey(
  options: ActionServiceDeactivatePublicKeyOptions = {},
): PromiseResult<DeactivatePublicKeyResponse> {
  const op = "actionServiceDeactivatePublicKey"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deactivatePublicKey(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

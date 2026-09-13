import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  ActivatePublicKeyRequestSchema,
  type ActivatePublicKeyResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceActivatePublicKeyRequest = MessageInitShape<typeof ActivatePublicKeyRequestSchema>

export type ActionServiceActivatePublicKeyOptions = EndpointCallOptions & {
  readonly request?: ActionServiceActivatePublicKeyRequest
}

/**
 * Activates a public key for an action target.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ActivatePublicKey
 */
export async function actionServiceActivatePublicKey(
  options: ActionServiceActivatePublicKeyOptions = {},
): PromiseResult<ActivatePublicKeyResponse> {
  const op = "actionServiceActivatePublicKey"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.activatePublicKey(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

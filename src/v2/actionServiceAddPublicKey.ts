import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActionService,
  AddPublicKeyRequestSchema,
  type AddPublicKeyResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ActionServiceAddPublicKeyRequest = MessageInitShape<typeof AddPublicKeyRequestSchema>

export type ActionServiceAddPublicKeyOptions = EndpointCallOptions & {
  readonly request?: ActionServiceAddPublicKeyRequest
}

/**
 * Adds a public key to an action target for payload encryption.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.AddPublicKey
 */
export async function actionServiceAddPublicKey(
  options: ActionServiceAddPublicKeyOptions = {},
): PromiseResult<AddPublicKeyResponse> {
  const op = "actionServiceAddPublicKey"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.addPublicKey(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

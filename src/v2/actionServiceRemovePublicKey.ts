import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  RemovePublicKeyRequestSchema,
  type RemovePublicKeyResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceRemovePublicKeyRequest = MessageInitShape<typeof RemovePublicKeyRequestSchema>

export type ActionServiceRemovePublicKeyOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceRemovePublicKeyRequest
  readonly token?: string
  readonly transport?: Transport
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
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.removePublicKey(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

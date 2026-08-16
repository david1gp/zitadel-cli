import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  DeactivatePublicKeyRequestSchema,
  type DeactivatePublicKeyResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceDeactivatePublicKeyRequest = MessageInitShape<typeof DeactivatePublicKeyRequestSchema>

export type ActionServiceDeactivatePublicKeyOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceDeactivatePublicKeyRequest
  readonly token?: string
  readonly transport?: Transport
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
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deactivatePublicKey(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

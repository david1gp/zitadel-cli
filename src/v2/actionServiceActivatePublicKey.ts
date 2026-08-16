import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  ActivatePublicKeyRequestSchema,
  type ActivatePublicKeyResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceActivatePublicKeyRequest = MessageInitShape<typeof ActivatePublicKeyRequestSchema>

export type ActionServiceActivatePublicKeyOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceActivatePublicKeyRequest
  readonly token?: string
  readonly transport?: Transport
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
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.activatePublicKey(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

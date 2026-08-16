import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  AddPublicKeyRequestSchema,
  type AddPublicKeyResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceAddPublicKeyRequest = MessageInitShape<typeof AddPublicKeyRequestSchema>

export type ActionServiceAddPublicKeyOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceAddPublicKeyRequest
  readonly token?: string
  readonly transport?: Transport
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
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.addPublicKey(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

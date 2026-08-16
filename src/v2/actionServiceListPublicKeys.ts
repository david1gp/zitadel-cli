import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  ListPublicKeysRequestSchema,
  type ListPublicKeysResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceListPublicKeysRequest = MessageInitShape<typeof ListPublicKeysRequestSchema>

export type ActionServiceListPublicKeysOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceListPublicKeysRequest
  readonly token?: string
  readonly transport?: Transport
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
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listPublicKeys(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

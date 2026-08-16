import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  ListTargetsRequestSchema,
  type ListTargetsResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceListTargetsRequest = MessageInitShape<typeof ListTargetsRequestSchema>

export type ActionServiceListTargetsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceListTargetsRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists all matching action targets.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListTargets
 */
export async function actionServiceListTargets(
  options: ActionServiceListTargetsOptions = {},
): PromiseResult<ListTargetsResponse> {
  const op = "actionServiceListTargets"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listTargets(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

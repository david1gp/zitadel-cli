import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  GetTargetRequestSchema,
  type GetTargetResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceGetTargetRequest = MessageInitShape<typeof GetTargetRequestSchema>

export type ActionServiceGetTargetOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceGetTargetRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Gets an action target by ID.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.GetTarget
 */
export async function actionServiceGetTarget(
  options: ActionServiceGetTargetOptions = {},
): PromiseResult<GetTargetResponse> {
  const op = "actionServiceGetTarget"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.getTarget(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

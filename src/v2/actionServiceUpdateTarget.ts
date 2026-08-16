import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  UpdateTargetRequestSchema,
  type UpdateTargetResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceUpdateTargetRequest = MessageInitShape<typeof UpdateTargetRequestSchema>

export type ActionServiceUpdateTargetOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceUpdateTargetRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Updates an action target for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.UpdateTarget
 */
export async function actionServiceUpdateTarget(
  options: ActionServiceUpdateTargetOptions = {},
): PromiseResult<UpdateTargetResponse> {
  const op = "actionServiceUpdateTarget"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.updateTarget(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

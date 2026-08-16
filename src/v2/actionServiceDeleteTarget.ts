import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  DeleteTargetRequestSchema,
  type DeleteTargetResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceDeleteTargetRequest = MessageInitShape<typeof DeleteTargetRequestSchema>

export type ActionServiceDeleteTargetOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceDeleteTargetRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Deletes an existing action target for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.DeleteTarget
 */
export async function actionServiceDeleteTarget(
  options: ActionServiceDeleteTargetOptions = {},
): PromiseResult<DeleteTargetResponse> {
  const op = "actionServiceDeleteTarget"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deleteTarget(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

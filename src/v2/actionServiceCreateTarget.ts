import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  CreateTargetRequestSchema,
  type CreateTargetResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceCreateTargetRequest = MessageInitShape<typeof CreateTargetRequestSchema>

export type ActionServiceCreateTargetOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceCreateTargetRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Creates an action target for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.CreateTarget
 */
export async function actionServiceCreateTarget(
  options: ActionServiceCreateTargetOptions = {},
): PromiseResult<CreateTargetResponse> {
  const op = "actionServiceCreateTarget"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.createTarget(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

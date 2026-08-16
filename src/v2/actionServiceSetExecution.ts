import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  SetExecutionRequestSchema,
  type SetExecutionResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceSetExecutionRequest = MessageInitShape<typeof SetExecutionRequestSchema>

export type ActionServiceSetExecutionOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceSetExecutionRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Sets an action execution and its ordered targets.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.SetExecution
 */
export async function actionServiceSetExecution(
  options: ActionServiceSetExecutionOptions = {},
): PromiseResult<SetExecutionResponse> {
  const op = "actionServiceSetExecution"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.setExecution(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

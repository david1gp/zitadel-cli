import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  ListExecutionsRequestSchema,
  type ListExecutionsResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceListExecutionsRequest = MessageInitShape<typeof ListExecutionsRequestSchema>

export type ActionServiceListExecutionsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceListExecutionsRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists all matching action executions.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutions
 */
export async function actionServiceListExecutions(
  options: ActionServiceListExecutionsOptions = {},
): PromiseResult<ListExecutionsResponse> {
  const op = "actionServiceListExecutions"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listExecutions(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

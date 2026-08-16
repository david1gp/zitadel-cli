import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  ListExecutionMethodsRequestSchema,
  type ListExecutionMethodsResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceListExecutionMethodsRequest = MessageInitShape<typeof ListExecutionMethodsRequestSchema>

export type ActionServiceListExecutionMethodsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceListExecutionMethodsRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists all available methods which can be used as conditions for executions.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutionMethods
 */
export async function actionServiceListExecutionMethods(
  options: ActionServiceListExecutionMethodsOptions = {},
): PromiseResult<ListExecutionMethodsResponse> {
  const op = "actionServiceListExecutionMethods"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listExecutionMethods(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

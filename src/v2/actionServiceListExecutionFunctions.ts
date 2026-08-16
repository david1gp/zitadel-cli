import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  ListExecutionFunctionsRequestSchema,
  type ListExecutionFunctionsResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceListExecutionFunctionsRequest = MessageInitShape<typeof ListExecutionFunctionsRequestSchema>

export type ActionServiceListExecutionFunctionsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceListExecutionFunctionsRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists all available functions which can be used as conditions for executions.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutionFunctions
 */
export async function actionServiceListExecutionFunctions(
  options: ActionServiceListExecutionFunctionsOptions = {},
): PromiseResult<ListExecutionFunctionsResponse> {
  const op = "actionServiceListExecutionFunctions"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listExecutionFunctions(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

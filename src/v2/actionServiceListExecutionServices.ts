import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActionService,
  ListExecutionServicesRequestSchema,
  type ListExecutionServicesResponse,
} from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ActionServiceListExecutionServicesRequest = MessageInitShape<typeof ListExecutionServicesRequestSchema>

export type ActionServiceListExecutionServicesOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ActionServiceListExecutionServicesRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists all services available for action execution conditions.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutionServices
 */
export async function actionServiceListExecutionServices(
  options: ActionServiceListExecutionServicesOptions = {},
): PromiseResult<ListExecutionServicesResponse> {
  const op = "actionServiceListExecutionServices"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listExecutionServices(request),
    operation: op,
    request: options.request ?? {},
    service: ActionService,
    token: options.token,
    transport: options.transport,
  })
}

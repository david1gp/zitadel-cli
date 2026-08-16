import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ApplicationService,
  ListApplicationKeysRequestSchema,
  type ListApplicationKeysResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ApplicationServiceListApplicationKeysRequest = MessageInitShape<typeof ListApplicationKeysRequestSchema>

export type ApplicationServiceListApplicationKeysOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ApplicationServiceListApplicationKeysRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists application keys matching the request parameters.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.ListApplicationKeys
 */
export async function applicationServiceListApplicationKeys(
  options: ApplicationServiceListApplicationKeysOptions = {},
): PromiseResult<ListApplicationKeysResponse> {
  const op = "applicationServiceListApplicationKeys"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listApplicationKeys(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ApplicationService,
  GetApplicationKeyRequestSchema,
  type GetApplicationKeyResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ApplicationServiceGetApplicationKeyRequest = MessageInitShape<typeof GetApplicationKeyRequestSchema>

export type ApplicationServiceGetApplicationKeyOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ApplicationServiceGetApplicationKeyRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Retrieves the application key matching the provided ID.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.GetApplicationKey
 */
export async function applicationServiceGetApplicationKey(
  options: ApplicationServiceGetApplicationKeyOptions = {},
): PromiseResult<GetApplicationKeyResponse> {
  const op = "applicationServiceGetApplicationKey"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.getApplicationKey(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

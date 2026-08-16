import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ApplicationService,
  CreateApplicationKeyRequestSchema,
  type CreateApplicationKeyResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ApplicationServiceCreateApplicationKeyRequest = MessageInitShape<typeof CreateApplicationKeyRequestSchema>

export type ApplicationServiceCreateApplicationKeyOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ApplicationServiceCreateApplicationKeyRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Creates an application key for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.CreateApplicationKey
 */
export async function applicationServiceCreateApplicationKey(
  options: ApplicationServiceCreateApplicationKeyOptions = {},
): PromiseResult<CreateApplicationKeyResponse> {
  const op = "applicationServiceCreateApplicationKey"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.createApplicationKey(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

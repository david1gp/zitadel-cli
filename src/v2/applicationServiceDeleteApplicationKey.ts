import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ApplicationService,
  DeleteApplicationKeyRequestSchema,
  type DeleteApplicationKeyResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ApplicationServiceDeleteApplicationKeyRequest = MessageInitShape<typeof DeleteApplicationKeyRequestSchema>

export type ApplicationServiceDeleteApplicationKeyOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ApplicationServiceDeleteApplicationKeyRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Deletes an application key matching the provided ID.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.DeleteApplicationKey
 */
export async function applicationServiceDeleteApplicationKey(
  options: ApplicationServiceDeleteApplicationKeyOptions = {},
): PromiseResult<DeleteApplicationKeyResponse> {
  const op = "applicationServiceDeleteApplicationKey"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deleteApplicationKey(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

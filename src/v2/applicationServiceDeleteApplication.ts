import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ApplicationService,
  DeleteApplicationRequestSchema,
  type DeleteApplicationResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ApplicationServiceDeleteApplicationRequest = MessageInitShape<typeof DeleteApplicationRequestSchema>

export type ApplicationServiceDeleteApplicationOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ApplicationServiceDeleteApplicationRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Deletes an existing application for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.DeleteApplication
 */
export async function applicationServiceDeleteApplication(
  options: ApplicationServiceDeleteApplicationOptions = {},
): PromiseResult<DeleteApplicationResponse> {
  const op = "applicationServiceDeleteApplication"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deleteApplication(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

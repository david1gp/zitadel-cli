import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ApplicationService,
  ReactivateApplicationRequestSchema,
  type ReactivateApplicationResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ApplicationServiceReactivateApplicationRequest = MessageInitShape<typeof ReactivateApplicationRequestSchema>

export type ApplicationServiceReactivateApplicationOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ApplicationServiceReactivateApplicationRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Reactivates an application for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.ReactivateApplication
 */
export async function applicationServiceReactivateApplication(
  options: ApplicationServiceReactivateApplicationOptions = {},
): PromiseResult<ReactivateApplicationResponse> {
  const op = "applicationServiceReactivateApplication"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.reactivateApplication(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

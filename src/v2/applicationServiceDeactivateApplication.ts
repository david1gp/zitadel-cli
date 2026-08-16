import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ApplicationService,
  DeactivateApplicationRequestSchema,
  type DeactivateApplicationResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ApplicationServiceDeactivateApplicationRequest = MessageInitShape<typeof DeactivateApplicationRequestSchema>

export type ApplicationServiceDeactivateApplicationOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ApplicationServiceDeactivateApplicationRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Deactivates an application for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.DeactivateApplication
 */
export async function applicationServiceDeactivateApplication(
  options: ApplicationServiceDeactivateApplicationOptions = {},
): PromiseResult<DeactivateApplicationResponse> {
  const op = "applicationServiceDeactivateApplication"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deactivateApplication(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

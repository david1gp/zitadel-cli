import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ApplicationService,
  UpdateApplicationRequestSchema,
  type UpdateApplicationResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ApplicationServiceUpdateApplicationRequest = MessageInitShape<typeof UpdateApplicationRequestSchema>

export type ApplicationServiceUpdateApplicationOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ApplicationServiceUpdateApplicationRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Updates an application for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.UpdateApplication
 */
export async function applicationServiceUpdateApplication(
  options: ApplicationServiceUpdateApplicationOptions = {},
): PromiseResult<UpdateApplicationResponse> {
  const op = "applicationServiceUpdateApplication"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.updateApplication(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ApplicationService,
  GetApplicationRequestSchema,
  type GetApplicationResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ApplicationServiceGetApplicationRequest = MessageInitShape<typeof GetApplicationRequestSchema>

export type ApplicationServiceGetApplicationOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ApplicationServiceGetApplicationRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Retrieves the application matching the provided ID.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.GetApplication
 */
export async function applicationServiceGetApplication(
  options: ApplicationServiceGetApplicationOptions = {},
): PromiseResult<GetApplicationResponse> {
  const op = "applicationServiceGetApplication"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.getApplication(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

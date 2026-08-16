import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ApplicationService,
  ListApplicationsRequestSchema,
  type ListApplicationsResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ApplicationServiceListApplicationsRequest = MessageInitShape<typeof ListApplicationsRequestSchema>

export type ApplicationServiceListApplicationsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ApplicationServiceListApplicationsRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists applications matching the request parameters.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.ListApplications
 */
export async function applicationServiceListApplications(
  options: ApplicationServiceListApplicationsOptions = {},
): PromiseResult<ListApplicationsResponse> {
  const op = "applicationServiceListApplications"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listApplications(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

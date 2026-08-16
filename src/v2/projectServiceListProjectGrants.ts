import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ListProjectGrantsRequestSchema,
  type ListProjectGrantsResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceListProjectGrantsRequest = MessageInitShape<typeof ListProjectGrantsRequestSchema>

export type ProjectServiceListProjectGrantsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceListProjectGrantsRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists project grants visible to the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ListProjectGrants
 */
export async function projectServiceListProjectGrants(
  options: ProjectServiceListProjectGrantsOptions = {},
): PromiseResult<ListProjectGrantsResponse> {
  const op = "projectServiceListProjectGrants"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listProjectGrants(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

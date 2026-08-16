import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ListProjectsRequestSchema,
  type ListProjectsResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceListProjectsRequest = MessageInitShape<typeof ListProjectsRequestSchema>

export type ProjectServiceListProjectsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceListProjectsRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists projects visible to the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ListProjects
 */
export async function projectServiceListProjects(
  options: ProjectServiceListProjectsOptions = {},
): PromiseResult<ListProjectsResponse> {
  const op = "projectServiceListProjects"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listProjects(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

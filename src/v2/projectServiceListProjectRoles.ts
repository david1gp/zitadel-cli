import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ListProjectRolesRequestSchema,
  type ListProjectRolesResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceListProjectRolesRequest = MessageInitShape<typeof ListProjectRolesRequestSchema>

export type ProjectServiceListProjectRolesOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceListProjectRolesRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists project roles matching the request parameters.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ListProjectRoles
 */
export async function projectServiceListProjectRoles(
  options: ProjectServiceListProjectRolesOptions = {},
): PromiseResult<ListProjectRolesResponse> {
  const op = "projectServiceListProjectRoles"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listProjectRoles(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ProjectService,
  UpdateProjectRoleRequestSchema,
  type UpdateProjectRoleResponse,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceUpdateProjectRoleRequest = MessageInitShape<typeof UpdateProjectRoleRequestSchema>

export type ProjectServiceUpdateProjectRoleOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceUpdateProjectRoleRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Updates a project role for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.UpdateProjectRole
 */
export async function projectServiceUpdateProjectRole(
  options: ProjectServiceUpdateProjectRoleOptions = {},
): PromiseResult<UpdateProjectRoleResponse> {
  const op = "projectServiceUpdateProjectRole"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.updateProjectRole(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

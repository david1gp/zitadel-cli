import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  AddProjectRoleRequestSchema,
  type AddProjectRoleResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceAddProjectRoleRequest = MessageInitShape<typeof AddProjectRoleRequestSchema>

export type ProjectServiceAddProjectRoleOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceAddProjectRoleRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Adds a role to a project for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.AddProjectRole
 */
export async function projectServiceAddProjectRole(
  options: ProjectServiceAddProjectRoleOptions = {},
): PromiseResult<AddProjectRoleResponse> {
  const op = "projectServiceAddProjectRole"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.addProjectRole(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ProjectService,
  RemoveProjectRoleRequestSchema,
  type RemoveProjectRoleResponse,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceRemoveProjectRoleRequest = MessageInitShape<typeof RemoveProjectRoleRequestSchema>

export type ProjectServiceRemoveProjectRoleOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceRemoveProjectRoleRequest
  readonly token?: string
  readonly transport?: Transport
}

export async function projectServiceRemoveProjectRole(
  options: ProjectServiceRemoveProjectRoleOptions = {},
): PromiseResult<RemoveProjectRoleResponse> {
  const op = "projectServiceRemoveProjectRole"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.removeProjectRole(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

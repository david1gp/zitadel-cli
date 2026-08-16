import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ProjectService,
  UpdateProjectGrantRequestSchema,
  type UpdateProjectGrantResponse,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceUpdateProjectGrantRequest = MessageInitShape<typeof UpdateProjectGrantRequestSchema>

export type ProjectServiceUpdateProjectGrantOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceUpdateProjectGrantRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Updates the roles of a project grant.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.UpdateProjectGrant
 */
export async function projectServiceUpdateProjectGrant(
  options: ProjectServiceUpdateProjectGrantOptions = {},
): PromiseResult<UpdateProjectGrantResponse> {
  const op = "projectServiceUpdateProjectGrant"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.updateProjectGrant(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

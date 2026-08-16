import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ProjectService,
  UpdateProjectRequestSchema,
  type UpdateProjectResponse,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceUpdateProjectRequest = MessageInitShape<typeof UpdateProjectRequestSchema>

export type ProjectServiceUpdateProjectOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceUpdateProjectRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Updates a project for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.UpdateProject
 */
export async function projectServiceUpdateProject(
  options: ProjectServiceUpdateProjectOptions = {},
): PromiseResult<UpdateProjectResponse> {
  const op = "projectServiceUpdateProject"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.updateProject(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  GetProjectRequestSchema,
  type GetProjectResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceGetProjectRequest = MessageInitShape<typeof GetProjectRequestSchema>

export type ProjectServiceGetProjectOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceGetProjectRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Returns the project identified by the requested ID.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.GetProject
 */
export async function projectServiceGetProject(
  options: ProjectServiceGetProjectOptions = {},
): PromiseResult<GetProjectResponse> {
  const op = "projectServiceGetProject"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.getProject(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

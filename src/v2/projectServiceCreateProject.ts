import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  CreateProjectRequestSchema,
  type CreateProjectResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceCreateProjectRequest = MessageInitShape<typeof CreateProjectRequestSchema>

export type ProjectServiceCreateProjectOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceCreateProjectRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Creates a project for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.CreateProject
 */
export async function projectServiceCreateProject(
  options: ProjectServiceCreateProjectOptions = {},
): PromiseResult<CreateProjectResponse> {
  const op = "projectServiceCreateProject"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.createProject(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActivateProjectRequestSchema,
  type ActivateProjectResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceActivateProjectRequest = MessageInitShape<typeof ActivateProjectRequestSchema>

export type ProjectServiceActivateProjectOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceActivateProjectRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Activates a project for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ActivateProject
 */
export async function projectServiceActivateProject(
  options: ProjectServiceActivateProjectOptions = {},
): PromiseResult<ActivateProjectResponse> {
  const op = "projectServiceActivateProject"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.activateProject(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

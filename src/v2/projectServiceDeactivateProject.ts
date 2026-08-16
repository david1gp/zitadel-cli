import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  DeactivateProjectRequestSchema,
  type DeactivateProjectResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceDeactivateProjectRequest = MessageInitShape<typeof DeactivateProjectRequestSchema>

export type ProjectServiceDeactivateProjectOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceDeactivateProjectRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Deactivates a project for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.DeactivateProject
 */
export async function projectServiceDeactivateProject(
  options: ProjectServiceDeactivateProjectOptions = {},
): PromiseResult<DeactivateProjectResponse> {
  const op = "projectServiceDeactivateProject"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deactivateProject(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  CreateProjectGrantRequestSchema,
  type CreateProjectGrantResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceCreateProjectGrantRequest = MessageInitShape<typeof CreateProjectGrantRequestSchema>

export type ProjectServiceCreateProjectGrantOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceCreateProjectGrantRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Grants a project to another organization.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.CreateProjectGrant
 */
export async function projectServiceCreateProjectGrant(
  options: ProjectServiceCreateProjectGrantOptions = {},
): PromiseResult<CreateProjectGrantResponse> {
  const op = "projectServiceCreateProjectGrant"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.createProjectGrant(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  DeleteProjectGrantRequestSchema,
  type DeleteProjectGrantResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceDeleteProjectGrantRequest = MessageInitShape<typeof DeleteProjectGrantRequestSchema>

export type ProjectServiceDeleteProjectGrantOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceDeleteProjectGrantRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Deletes a project grant for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.DeleteProjectGrant
 */
export async function projectServiceDeleteProjectGrant(
  options: ProjectServiceDeleteProjectGrantOptions = {},
): PromiseResult<DeleteProjectGrantResponse> {
  const op = "projectServiceDeleteProjectGrant"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deleteProjectGrant(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

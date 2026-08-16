import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActivateProjectGrantRequestSchema,
  type ActivateProjectGrantResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceActivateProjectGrantRequest = MessageInitShape<typeof ActivateProjectGrantRequestSchema>

export type ProjectServiceActivateProjectGrantOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceActivateProjectGrantRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Activates a project grant for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ActivateProjectGrant
 */
export async function projectServiceActivateProjectGrant(
  options: ProjectServiceActivateProjectGrantOptions = {},
): PromiseResult<ActivateProjectGrantResponse> {
  const op = "projectServiceActivateProjectGrant"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.activateProjectGrant(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

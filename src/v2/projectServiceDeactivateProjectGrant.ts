import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  DeactivateProjectGrantRequestSchema,
  type DeactivateProjectGrantResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ProjectServiceDeactivateProjectGrantRequest = MessageInitShape<typeof DeactivateProjectGrantRequestSchema>

export type ProjectServiceDeactivateProjectGrantOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ProjectServiceDeactivateProjectGrantRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Sets the state of a project grant to deactivated.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.DeactivateProjectGrant
 */
export async function projectServiceDeactivateProjectGrant(
  options: ProjectServiceDeactivateProjectGrantOptions = {},
): PromiseResult<DeactivateProjectGrantResponse> {
  const op = "projectServiceDeactivateProjectGrant"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deactivateProjectGrant(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

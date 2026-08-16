import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  InternalPermissionService,
  UpdateAdministratorRequestSchema,
  type UpdateAdministratorResponse,
} from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type InternalPermissionServiceUpdateAdministratorRequest = MessageInitShape<
  typeof UpdateAdministratorRequestSchema
>

export type InternalPermissionServiceUpdateAdministratorOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: InternalPermissionServiceUpdateAdministratorRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Updates the administrator roles for a user and resource.
 *
 * @see https://zitadel.com/docs/reference/api/internal_permission/zitadel.internal_permission.v2.InternalPermissionService.UpdateAdministrator
 */
export async function internalPermissionServiceUpdateAdministrator(
  options: InternalPermissionServiceUpdateAdministratorOptions = {},
): PromiseResult<UpdateAdministratorResponse> {
  const op = "internalPermissionServiceUpdateAdministrator"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.updateAdministrator(request),
    operation: op,
    request: options.request ?? {},
    service: InternalPermissionService,
    token: options.token,
    transport: options.transport,
  })
}

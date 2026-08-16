import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  DeleteAdministratorRequestSchema,
  InternalPermissionService,
  type DeleteAdministratorResponse,
} from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type InternalPermissionServiceDeleteAdministratorRequest = MessageInitShape<
  typeof DeleteAdministratorRequestSchema
>

export type InternalPermissionServiceDeleteAdministratorOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: InternalPermissionServiceDeleteAdministratorRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Revokes an administrator role from a user.
 *
 * @see https://zitadel.com/docs/reference/api/internal_permission/zitadel.internal_permission.v2.InternalPermissionService.DeleteAdministrator
 */
export async function internalPermissionServiceDeleteAdministrator(
  options: InternalPermissionServiceDeleteAdministratorOptions = {},
): PromiseResult<DeleteAdministratorResponse> {
  const op = "internalPermissionServiceDeleteAdministrator"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deleteAdministrator(request),
    operation: op,
    request: options.request ?? {},
    service: InternalPermissionService,
    token: options.token,
    transport: options.transport,
  })
}

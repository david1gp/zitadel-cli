import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  CreateAdministratorRequestSchema,
  InternalPermissionService,
  type CreateAdministratorResponse,
} from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type InternalPermissionServiceCreateAdministratorRequest = MessageInitShape<
  typeof CreateAdministratorRequestSchema
>

export type InternalPermissionServiceCreateAdministratorOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: InternalPermissionServiceCreateAdministratorRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Grants an administrator role to a user for a specific resource.
 *
 * @see https://zitadel.com/docs/reference/api/internal_permission/zitadel.internal_permission.v2.InternalPermissionService.CreateAdministrator
 */
export async function internalPermissionServiceCreateAdministrator(
  options: InternalPermissionServiceCreateAdministratorOptions = {},
): PromiseResult<CreateAdministratorResponse> {
  const op = "internalPermissionServiceCreateAdministrator"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.createAdministrator(request),
    operation: op,
    request: options.request ?? {},
    service: InternalPermissionService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  InternalPermissionService,
  ListAdministratorsRequestSchema,
  type ListAdministratorsResponse,
} from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type InternalPermissionServiceListAdministratorsRequest = MessageInitShape<
  typeof ListAdministratorsRequestSchema
>

export type InternalPermissionServiceListAdministratorsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: InternalPermissionServiceListAdministratorsRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists administrators visible to the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/internal_permission/zitadel.internal_permission.v2.InternalPermissionService.ListAdministrators
 */
export async function internalPermissionServiceListAdministrators(
  options: InternalPermissionServiceListAdministratorsOptions = {},
): PromiseResult<ListAdministratorsResponse> {
  const op = "internalPermissionServiceListAdministrators"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listAdministrators(request),
    operation: op,
    request: options.request ?? {},
    service: InternalPermissionService,
    token: options.token,
    transport: options.transport,
  })
}

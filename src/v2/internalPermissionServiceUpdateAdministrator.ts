import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  InternalPermissionService,
  UpdateAdministratorRequestSchema,
  type UpdateAdministratorResponse,
} from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type InternalPermissionServiceUpdateAdministratorRequest = MessageInitShape<
  typeof UpdateAdministratorRequestSchema
>

export type InternalPermissionServiceUpdateAdministratorOptions = EndpointCallOptions & {
  readonly request?: InternalPermissionServiceUpdateAdministratorRequest
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
    ...options,
    invoke: (client, request) => client.updateAdministrator(request),
    operation: op,
    request: options.request ?? {},
    service: InternalPermissionService,
    token: options.token,
    transport: options.transport,
  })
}

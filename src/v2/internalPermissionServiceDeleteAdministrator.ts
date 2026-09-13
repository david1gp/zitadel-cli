import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  DeleteAdministratorRequestSchema,
  InternalPermissionService,
  type DeleteAdministratorResponse,
} from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type InternalPermissionServiceDeleteAdministratorRequest = MessageInitShape<
  typeof DeleteAdministratorRequestSchema
>

export type InternalPermissionServiceDeleteAdministratorOptions = EndpointCallOptions & {
  readonly request?: InternalPermissionServiceDeleteAdministratorRequest
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
    ...options,
    invoke: (client, request) => client.deleteAdministrator(request),
    operation: op,
    request: options.request ?? {},
    service: InternalPermissionService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  CreateAdministratorRequestSchema,
  InternalPermissionService,
  type CreateAdministratorResponse,
} from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type InternalPermissionServiceCreateAdministratorRequest = MessageInitShape<
  typeof CreateAdministratorRequestSchema
>

export type InternalPermissionServiceCreateAdministratorOptions = EndpointCallOptions & {
  readonly request?: InternalPermissionServiceCreateAdministratorRequest
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
    ...options,
    invoke: (client, request) => client.createAdministrator(request),
    operation: op,
    request: options.request ?? {},
    service: InternalPermissionService,
    token: options.token,
    transport: options.transport,
  })
}

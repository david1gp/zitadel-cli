import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  InternalPermissionService,
  ListAdministratorsRequestSchema,
  type ListAdministratorsResponse,
} from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type InternalPermissionServiceListAdministratorsRequest = MessageInitShape<
  typeof ListAdministratorsRequestSchema
>

export type InternalPermissionServiceListAdministratorsOptions = EndpointCallOptions & {
  readonly request?: InternalPermissionServiceListAdministratorsRequest
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
    ...options,
    invoke: (client, request) => client.listAdministrators(request),
    operation: op,
    request: options.request ?? {},
    service: InternalPermissionService,
    token: options.token,
    transport: options.transport,
  })
}

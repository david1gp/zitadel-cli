import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ListAuthenticationMethodTypesRequestSchema,
  type ListAuthenticationMethodTypesResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListAuthenticationMethodTypesRequest = MessageInitShape<
  typeof ListAuthenticationMethodTypesRequestSchema
>

export type UserServiceListAuthenticationMethodTypesOptions = EndpointCallOptions & {
  readonly request?: UserServiceListAuthenticationMethodTypesRequest
}

/**
 * Lists the authentication method types available to a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListAuthenticationMethodTypes
 */
export async function userServiceListAuthenticationMethodTypes(
  options: UserServiceListAuthenticationMethodTypesOptions = {},
): PromiseResult<ListAuthenticationMethodTypesResponse> {
  const op = "userServiceListAuthenticationMethodTypes"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listAuthenticationMethodTypes(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

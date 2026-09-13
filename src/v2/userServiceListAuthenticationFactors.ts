import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ListAuthenticationFactorsRequestSchema,
  type ListAuthenticationFactorsResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListAuthenticationFactorsRequest = MessageInitShape<
  typeof ListAuthenticationFactorsRequestSchema
>

export type UserServiceListAuthenticationFactorsOptions = EndpointCallOptions & {
  readonly request?: UserServiceListAuthenticationFactorsRequest
}

/**
 * Lists authentication factors for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListAuthenticationFactors
 */
export async function userServiceListAuthenticationFactors(
  options: UserServiceListAuthenticationFactorsOptions = {},
): PromiseResult<ListAuthenticationFactorsResponse> {
  const op = "userServiceListAuthenticationFactors"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listAuthenticationFactors(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

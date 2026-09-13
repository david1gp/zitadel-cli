import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ListPersonalAccessTokensRequestSchema,
  type ListPersonalAccessTokensResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListPersonalAccessTokensRequest = MessageInitShape<typeof ListPersonalAccessTokensRequestSchema>

export type UserServiceListPersonalAccessTokensOptions = EndpointCallOptions & {
  readonly request?: UserServiceListPersonalAccessTokensRequest
}

/**
 * Lists personal access tokens visible to the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListPersonalAccessTokens
 */
export async function userServiceListPersonalAccessTokens(
  options: UserServiceListPersonalAccessTokensOptions = {},
): PromiseResult<ListPersonalAccessTokensResponse> {
  const op = "userServiceListPersonalAccessTokens"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listPersonalAccessTokens(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

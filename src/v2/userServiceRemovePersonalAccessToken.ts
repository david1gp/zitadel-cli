import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  RemovePersonalAccessTokenRequestSchema,
  type RemovePersonalAccessTokenResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemovePersonalAccessTokenRequest = MessageInitShape<
  typeof RemovePersonalAccessTokenRequestSchema
>

export type UserServiceRemovePersonalAccessTokenOptions = EndpointCallOptions & {
  readonly request?: UserServiceRemovePersonalAccessTokenRequest
}

/**
 * Removes a personal access token from a machine user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemovePersonalAccessToken
 */
export async function userServiceRemovePersonalAccessToken(
  options: UserServiceRemovePersonalAccessTokenOptions = {},
): PromiseResult<RemovePersonalAccessTokenResponse> {
  const op = "userServiceRemovePersonalAccessToken"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.removePersonalAccessToken(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

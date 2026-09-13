import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveIDPLinkRequestSchema, type RemoveIDPLinkResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveIDPLinkRequest = MessageInitShape<typeof RemoveIDPLinkRequestSchema>

export type UserServiceRemoveIDPLinkOptions = EndpointCallOptions & {
  readonly request?: UserServiceRemoveIDPLinkRequest
}

/**
 * Removes an identity provider link from a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveIDPLink
 */
export async function userServiceRemoveIDPLink(
  options: UserServiceRemoveIDPLinkOptions = {},
): PromiseResult<RemoveIDPLinkResponse> {
  const op = "userServiceRemoveIDPLink"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.removeIDPLink(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListIDPLinksRequestSchema, type ListIDPLinksResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListIDPLinksRequest = MessageInitShape<typeof ListIDPLinksRequestSchema>

export type UserServiceListIDPLinksOptions = EndpointCallOptions & {
  readonly request?: UserServiceListIDPLinksRequest
}

/**
 * Lists identity provider links for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListIDPLinks
 */
export async function userServiceListIDPLinks(
  options: UserServiceListIDPLinksOptions = {},
): PromiseResult<ListIDPLinksResponse> {
  const op = "userServiceListIDPLinks"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listIDPLinks(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

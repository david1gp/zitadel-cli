import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddIDPLinkRequestSchema, type AddIDPLinkResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceAddIDPLinkRequest = MessageInitShape<typeof AddIDPLinkRequestSchema>

export type UserServiceAddIDPLinkOptions = EndpointCallOptions & {
  readonly request?: UserServiceAddIDPLinkRequest
}

/**
 * Adds an identity provider link to a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddIDPLink
 */
export async function userServiceAddIDPLink(
  options: UserServiceAddIDPLinkOptions = {},
): PromiseResult<AddIDPLinkResponse> {
  const op = "userServiceAddIDPLink"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.addIDPLink(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

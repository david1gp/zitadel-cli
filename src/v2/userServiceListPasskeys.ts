import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListPasskeysRequestSchema, type ListPasskeysResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListPasskeysRequest = MessageInitShape<typeof ListPasskeysRequestSchema>

export type UserServiceListPasskeysOptions = EndpointCallOptions & {
  readonly request?: UserServiceListPasskeysRequest
}

/**
 * Lists passkeys for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListPasskeys
 */
export async function userServiceListPasskeys(
  options: UserServiceListPasskeysOptions = {},
): PromiseResult<ListPasskeysResponse> {
  const op = "userServiceListPasskeys"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listPasskeys(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

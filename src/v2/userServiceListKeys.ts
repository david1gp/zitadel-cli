import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListKeysRequestSchema, type ListKeysResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListKeysRequest = MessageInitShape<typeof ListKeysRequestSchema>

export type UserServiceListKeysOptions = EndpointCallOptions & {
  readonly request?: UserServiceListKeysRequest
}

/**
 * Lists user keys matching the request parameters.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListKeys
 */
export async function userServiceListKeys(options: UserServiceListKeysOptions = {}): PromiseResult<ListKeysResponse> {
  const op = "userServiceListKeys"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listKeys(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

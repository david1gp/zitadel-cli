import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddKeyRequestSchema, type AddKeyResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceAddKeyRequest = MessageInitShape<typeof AddKeyRequestSchema>

export type UserServiceAddKeyOptions = EndpointCallOptions & {
  readonly request?: UserServiceAddKeyRequest
}

/**
 * Adds a key for a machine user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddKey
 */
export async function userServiceAddKey(options: UserServiceAddKeyOptions = {}): PromiseResult<AddKeyResponse> {
  const op = "userServiceAddKey"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.addKey(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

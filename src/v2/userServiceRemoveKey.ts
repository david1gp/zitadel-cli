import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveKeyRequestSchema, type RemoveKeyResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveKeyRequest = MessageInitShape<typeof RemoveKeyRequestSchema>

export type UserServiceRemoveKeyOptions = EndpointCallOptions & {
  readonly request?: UserServiceRemoveKeyRequest
}

/**
 * Removes a key from a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveKey
 */
export async function userServiceRemoveKey(
  options: UserServiceRemoveKeyOptions = {},
): PromiseResult<RemoveKeyResponse> {
  const op = "userServiceRemoveKey"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.removeKey(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

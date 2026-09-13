import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemovePasskeyRequestSchema, type RemovePasskeyResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemovePasskeyRequest = MessageInitShape<typeof RemovePasskeyRequestSchema>

export type UserServiceRemovePasskeyOptions = EndpointCallOptions & {
  readonly request?: UserServiceRemovePasskeyRequest
}

/**
 * Removes a passkey from a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemovePasskey
 */
export async function userServiceRemovePasskey(
  options: UserServiceRemovePasskeyOptions = {},
): PromiseResult<RemovePasskeyResponse> {
  const op = "userServiceRemovePasskey"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.removePasskey(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

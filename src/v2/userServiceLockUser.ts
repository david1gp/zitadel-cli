import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { LockUserRequestSchema, type LockUserResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceLockUserRequest = MessageInitShape<typeof LockUserRequestSchema>

export type UserServiceLockUserOptions = EndpointCallOptions & {
  readonly request?: UserServiceLockUserRequest
}

/**
 * Locks a user for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.LockUser
 */
export async function userServiceLockUser(options: UserServiceLockUserOptions = {}): PromiseResult<LockUserResponse> {
  const op = "userServiceLockUser"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.lockUser(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

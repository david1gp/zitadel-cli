import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { UnlockUserRequestSchema, type UnlockUserResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceUnlockUserRequest = MessageInitShape<typeof UnlockUserRequestSchema>

export type UserServiceUnlockUserOptions = EndpointCallOptions & {
  readonly request?: UserServiceUnlockUserRequest
}

/**
 * Unlocks a locked user for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.UnlockUser
 */
export async function userServiceUnlockUser(
  options: UserServiceUnlockUserOptions = {},
): PromiseResult<UnlockUserResponse> {
  const op = "userServiceUnlockUser"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.unlockUser(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

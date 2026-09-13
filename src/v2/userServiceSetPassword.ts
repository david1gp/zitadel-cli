import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { SetPasswordRequestSchema, type SetPasswordResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceSetPasswordRequest = MessageInitShape<typeof SetPasswordRequestSchema>

export type UserServiceSetPasswordOptions = EndpointCallOptions & {
  readonly request?: UserServiceSetPasswordRequest
}

/**
 * Changes a user's password with either the current password or a verification code.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.SetPassword
 */
export async function userServiceSetPassword(
  options: UserServiceSetPasswordOptions = {},
): PromiseResult<SetPasswordResponse> {
  const op = "userServiceSetPassword"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.setPassword(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

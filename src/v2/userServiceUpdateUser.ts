import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { UpdateUserRequestSchema, type UpdateUserResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceUpdateUserRequest = MessageInitShape<typeof UpdateUserRequestSchema>

export type UserServiceUpdateUserOptions = EndpointCallOptions & {
  readonly request?: UserServiceUpdateUserRequest
}

/**
 * Partially updates a user for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.UpdateUser
 */
export async function userServiceUpdateUser(
  options: UserServiceUpdateUserOptions = {},
): PromiseResult<UpdateUserResponse> {
  const op = "userServiceUpdateUser"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.updateUser(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

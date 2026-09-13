import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeleteUserRequestSchema, type DeleteUserResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceDeleteUserRequest = MessageInitShape<typeof DeleteUserRequestSchema>

export type UserServiceDeleteUserOptions = EndpointCallOptions & {
  readonly request?: UserServiceDeleteUserRequest
}

/**
 * Deletes an existing user for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.DeleteUser
 */
export async function userServiceDeleteUser(
  options: UserServiceDeleteUserOptions = {},
): PromiseResult<DeleteUserResponse> {
  const op = "userServiceDeleteUser"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deleteUser(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

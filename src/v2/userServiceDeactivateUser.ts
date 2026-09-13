import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  DeactivateUserRequestSchema,
  type DeactivateUserResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceDeactivateUserRequest = MessageInitShape<typeof DeactivateUserRequestSchema>

export type UserServiceDeactivateUserOptions = EndpointCallOptions & {
  readonly request?: UserServiceDeactivateUserRequest
}

/**
 * Deactivates a user for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.DeactivateUser
 */
export async function userServiceDeactivateUser(
  options: UserServiceDeactivateUserOptions = {},
): PromiseResult<DeactivateUserResponse> {
  const op = "userServiceDeactivateUser"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deactivateUser(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

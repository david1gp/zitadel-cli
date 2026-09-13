import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ReactivateUserRequestSchema,
  type ReactivateUserResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceReactivateUserRequest = MessageInitShape<typeof ReactivateUserRequestSchema>

export type UserServiceReactivateUserOptions = EndpointCallOptions & {
  readonly request?: UserServiceReactivateUserRequest
}

/**
 * Reactivates a deactivated user for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ReactivateUser
 */
export async function userServiceReactivateUser(
  options: UserServiceReactivateUserOptions = {},
): PromiseResult<ReactivateUserResponse> {
  const op = "userServiceReactivateUser"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.reactivateUser(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

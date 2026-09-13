import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListUsersRequestSchema, type ListUsersResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListUsersRequest = MessageInitShape<typeof ListUsersRequestSchema>

export type UserServiceListUsersOptions = EndpointCallOptions & {
  readonly request?: UserServiceListUsersRequest
}

/**
 * Lists users visible to the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListUsers
 */
export async function userServiceListUsers(
  options: UserServiceListUsersOptions = {},
): PromiseResult<ListUsersResponse> {
  const op = "userServiceListUsers"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listUsers(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

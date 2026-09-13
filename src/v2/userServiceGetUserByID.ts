import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { GetUserByIDRequestSchema, type GetUserByIDResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceGetUserByIDRequest = MessageInitShape<typeof GetUserByIDRequestSchema>

export type UserServiceGetUserByIDOptions = EndpointCallOptions & {
  readonly request?: UserServiceGetUserByIDRequest
}

/**
 * Returns the user identified by the requested ID.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.GetUserByID
 */
export async function userServiceGetUserByID(
  options: UserServiceGetUserByIDOptions = {},
): PromiseResult<GetUserByIDResponse> {
  const op = "userServiceGetUserByID"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.getUserByID(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

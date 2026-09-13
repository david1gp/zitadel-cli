import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { CreateUserRequestSchema, type CreateUserResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceCreateUserRequest = MessageInitShape<typeof CreateUserRequestSchema>

export type UserServiceCreateUserOptions = EndpointCallOptions & {
  readonly request?: UserServiceCreateUserRequest
}

/**
 * Creates a user or service account in the specified organization.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreateUser
 */
export async function userServiceCreateUser(
  options: UserServiceCreateUserOptions = {},
): PromiseResult<CreateUserResponse> {
  const op = "userServiceCreateUser"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.createUser(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveU2FRequestSchema, type RemoveU2FResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveU2FRequest = MessageInitShape<typeof RemoveU2FRequestSchema>

export type UserServiceRemoveU2FOptions = EndpointCallOptions & {
  readonly request?: UserServiceRemoveU2FRequest
}

/**
 * Removes a U2F authenticator for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveU2F
 */
export async function userServiceRemoveU2F(
  options: UserServiceRemoveU2FOptions = {},
): PromiseResult<RemoveU2FResponse> {
  const op = "userServiceRemoveU2F"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.removeU2F(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

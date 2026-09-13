import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RegisterU2FRequestSchema, type RegisterU2FResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRegisterU2FRequest = MessageInitShape<typeof RegisterU2FRequestSchema>

export type UserServiceRegisterU2FOptions = EndpointCallOptions & {
  readonly request?: UserServiceRegisterU2FRequest
}

/**
 * Starts U2F registration for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RegisterU2F
 */
export async function userServiceRegisterU2F(
  options: UserServiceRegisterU2FOptions = {},
): PromiseResult<RegisterU2FResponse> {
  const op = "userServiceRegisterU2F"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.registerU2F(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

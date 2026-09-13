import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveTOTPRequestSchema, type RemoveTOTPResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveTOTPRequest = MessageInitShape<typeof RemoveTOTPRequestSchema>

export type UserServiceRemoveTOTPOptions = EndpointCallOptions & {
  readonly request?: UserServiceRemoveTOTPRequest
}

/**
 * Removes the configured TOTP generator from a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveTOTP
 */
export async function userServiceRemoveTOTP(
  options: UserServiceRemoveTOTPOptions = {},
): PromiseResult<RemoveTOTPResponse> {
  const op = "userServiceRemoveTOTP"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.removeTOTP(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

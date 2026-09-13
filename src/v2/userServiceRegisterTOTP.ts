import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RegisterTOTPRequestSchema, type RegisterTOTPResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRegisterTOTPRequest = MessageInitShape<typeof RegisterTOTPRequestSchema>

export type UserServiceRegisterTOTPOptions = EndpointCallOptions & {
  readonly request?: UserServiceRegisterTOTPRequest
}

/**
 * Starts TOTP registration for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RegisterTOTP
 */
export async function userServiceRegisterTOTP(
  options: UserServiceRegisterTOTPOptions = {},
): PromiseResult<RegisterTOTPResponse> {
  const op = "userServiceRegisterTOTP"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.registerTOTP(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

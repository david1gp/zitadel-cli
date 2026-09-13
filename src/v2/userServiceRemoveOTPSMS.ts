import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveOTPSMSRequestSchema, type RemoveOTPSMSResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveOTPSMSRequest = MessageInitShape<typeof RemoveOTPSMSRequestSchema>

export type UserServiceRemoveOTPSMSOptions = EndpointCallOptions & {
  readonly request?: UserServiceRemoveOTPSMSRequest
}

/**
 * Removes a user's configured SMS-based OTP factor.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveOTPSMS
 */
export async function userServiceRemoveOTPSMS(
  options: UserServiceRemoveOTPSMSOptions = {},
): PromiseResult<RemoveOTPSMSResponse> {
  const op = "userServiceRemoveOTPSMS"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.removeOTPSMS(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddOTPSMSRequestSchema, type AddOTPSMSResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceAddOTPSMSRequest = MessageInitShape<typeof AddOTPSMSRequestSchema>

export type UserServiceAddOTPSMSOptions = EndpointCallOptions & {
  readonly request?: UserServiceAddOTPSMSRequest
}

/**
 * Adds SMS-based OTP authentication for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddOTPSMS
 */
export async function userServiceAddOTPSMS(
  options: UserServiceAddOTPSMSOptions = {},
): PromiseResult<AddOTPSMSResponse> {
  const op = "userServiceAddOTPSMS"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.addOTPSMS(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

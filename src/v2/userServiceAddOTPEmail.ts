import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddOTPEmailRequestSchema, type AddOTPEmailResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceAddOTPEmailRequest = MessageInitShape<typeof AddOTPEmailRequestSchema>

export type UserServiceAddOTPEmailOptions = EndpointCallOptions & {
  readonly request?: UserServiceAddOTPEmailRequest
}

/**
 * Adds an OTP email factor to a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddOTPEmail
 */
export async function userServiceAddOTPEmail(
  options: UserServiceAddOTPEmailOptions = {},
): PromiseResult<AddOTPEmailResponse> {
  const op = "userServiceAddOTPEmail"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.addOTPEmail(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

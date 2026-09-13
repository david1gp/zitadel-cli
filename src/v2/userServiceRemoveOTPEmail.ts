import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  RemoveOTPEmailRequestSchema,
  type RemoveOTPEmailResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveOTPEmailRequest = MessageInitShape<typeof RemoveOTPEmailRequestSchema>

export type UserServiceRemoveOTPEmailOptions = EndpointCallOptions & {
  readonly request?: UserServiceRemoveOTPEmailRequest
}

/**
 * Removes a user's configured OTP email factor.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveOTPEmail
 */
export async function userServiceRemoveOTPEmail(
  options: UserServiceRemoveOTPEmailOptions = {},
): PromiseResult<RemoveOTPEmailResponse> {
  const op = "userServiceRemoveOTPEmail"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.removeOTPEmail(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

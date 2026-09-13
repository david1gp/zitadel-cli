import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { VerifyEmailRequestSchema, type VerifyEmailResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceVerifyEmailRequest = MessageInitShape<typeof VerifyEmailRequestSchema>

export type UserServiceVerifyEmailOptions = EndpointCallOptions & {
  readonly request?: UserServiceVerifyEmailRequest
}

/**
 * Verifies a user's email address with the provided verification code.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyEmail
 */
export async function userServiceVerifyEmail(
  options: UserServiceVerifyEmailOptions = {},
): PromiseResult<VerifyEmailResponse> {
  const op = "userServiceVerifyEmail"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.verifyEmail(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

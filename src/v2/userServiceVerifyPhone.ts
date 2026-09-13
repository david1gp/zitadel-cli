import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { VerifyPhoneRequestSchema, type VerifyPhoneResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceVerifyPhoneRequest = MessageInitShape<typeof VerifyPhoneRequestSchema>

export type UserServiceVerifyPhoneOptions = EndpointCallOptions & {
  readonly request?: UserServiceVerifyPhoneRequest
}

/**
 * Verifies a user's phone number with the generated verification code.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyPhone
 */
export async function userServiceVerifyPhone(
  options: UserServiceVerifyPhoneOptions = {},
): PromiseResult<VerifyPhoneResponse> {
  const op = "userServiceVerifyPhone"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.verifyPhone(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

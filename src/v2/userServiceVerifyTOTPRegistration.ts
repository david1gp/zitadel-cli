import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  VerifyTOTPRegistrationRequestSchema,
  type VerifyTOTPRegistrationResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceVerifyTOTPRegistrationRequest = MessageInitShape<typeof VerifyTOTPRegistrationRequestSchema>

export type UserServiceVerifyTOTPRegistrationOptions = EndpointCallOptions & {
  readonly request?: UserServiceVerifyTOTPRegistrationRequest
}

/**
 * Verifies a user's TOTP registration with the provided code.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyTOTPRegistration
 */
export async function userServiceVerifyTOTPRegistration(
  options: UserServiceVerifyTOTPRegistrationOptions = {},
): PromiseResult<VerifyTOTPRegistrationResponse> {
  const op = "userServiceVerifyTOTPRegistration"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.verifyTOTPRegistration(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

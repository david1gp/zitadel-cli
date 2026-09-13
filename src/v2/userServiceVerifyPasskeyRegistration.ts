import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  VerifyPasskeyRegistrationRequestSchema,
  type VerifyPasskeyRegistrationResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceVerifyPasskeyRegistrationRequest = MessageInitShape<
  typeof VerifyPasskeyRegistrationRequestSchema
>

export type UserServiceVerifyPasskeyRegistrationOptions = EndpointCallOptions & {
  readonly request?: UserServiceVerifyPasskeyRegistrationRequest
}

/**
 * Verifies a passkey registration for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyPasskeyRegistration
 */
export async function userServiceVerifyPasskeyRegistration(
  options: UserServiceVerifyPasskeyRegistrationOptions = {},
): PromiseResult<VerifyPasskeyRegistrationResponse> {
  const op = "userServiceVerifyPasskeyRegistration"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.verifyPasskeyRegistration(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  VerifyU2FRegistrationRequestSchema,
  type VerifyU2FRegistrationResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceVerifyU2FRegistrationRequest = MessageInitShape<typeof VerifyU2FRegistrationRequestSchema>

export type UserServiceVerifyU2FRegistrationOptions = EndpointCallOptions & {
  readonly request?: UserServiceVerifyU2FRegistrationRequest
}

/**
 * Verifies a U2F registration for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyU2FRegistration
 */
export async function userServiceVerifyU2FRegistration(
  options: UserServiceVerifyU2FRegistrationOptions = {},
): PromiseResult<VerifyU2FRegistrationResponse> {
  const op = "userServiceVerifyU2FRegistration"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.verifyU2FRegistration(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

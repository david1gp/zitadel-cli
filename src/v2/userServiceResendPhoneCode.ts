import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ResendPhoneCodeRequestSchema,
  type ResendPhoneCodeResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceResendPhoneCodeRequest = MessageInitShape<typeof ResendPhoneCodeRequestSchema>

export type UserServiceResendPhoneCodeOptions = EndpointCallOptions & {
  readonly request?: UserServiceResendPhoneCodeRequest
}

/**
 * Resends a phone verification code for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ResendPhoneCode
 */
export async function userServiceResendPhoneCode(
  options: UserServiceResendPhoneCodeOptions = {},
): PromiseResult<ResendPhoneCodeResponse> {
  const op = "userServiceResendPhoneCode"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.resendPhoneCode(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

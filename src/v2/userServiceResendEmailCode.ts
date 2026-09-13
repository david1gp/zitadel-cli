import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ResendEmailCodeRequestSchema,
  type ResendEmailCodeResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceResendEmailCodeRequest = MessageInitShape<typeof ResendEmailCodeRequestSchema>

export type UserServiceResendEmailCodeOptions = EndpointCallOptions & {
  readonly request?: UserServiceResendEmailCodeRequest
}

/**
 * Resends the code used to verify a user's email address.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ResendEmailCode
 */
export async function userServiceResendEmailCode(
  options: UserServiceResendEmailCodeOptions = {},
): PromiseResult<ResendEmailCodeResponse> {
  const op = "userServiceResendEmailCode"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.resendEmailCode(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { SendEmailCodeRequestSchema, type SendEmailCodeResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceSendEmailCodeRequest = MessageInitShape<typeof SendEmailCodeRequestSchema>

export type UserServiceSendEmailCodeOptions = EndpointCallOptions & {
  readonly request?: UserServiceSendEmailCodeRequest
}

/**
 * Sends a code to verify a user's email address.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.SendEmailCode
 */
export async function userServiceSendEmailCode(
  options: UserServiceSendEmailCodeOptions = {},
): PromiseResult<SendEmailCodeResponse> {
  const op = "userServiceSendEmailCode"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.sendEmailCode(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

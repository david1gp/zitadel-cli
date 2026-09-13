import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  VerifyInviteCodeRequestSchema,
  type VerifyInviteCodeResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceVerifyInviteCodeRequest = MessageInitShape<typeof VerifyInviteCodeRequestSchema>

export type UserServiceVerifyInviteCodeOptions = EndpointCallOptions & {
  readonly request?: UserServiceVerifyInviteCodeRequest
}

/**
 * Verifies a user's invite code and enables initial authentication setup.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyInviteCode
 */
export async function userServiceVerifyInviteCode(
  options: UserServiceVerifyInviteCodeOptions = {},
): PromiseResult<VerifyInviteCodeResponse> {
  const op = "userServiceVerifyInviteCode"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.verifyInviteCode(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

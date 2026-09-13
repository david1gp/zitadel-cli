import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  CreateInviteCodeRequestSchema,
  type CreateInviteCodeResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceCreateInviteCodeRequest = MessageInitShape<typeof CreateInviteCodeRequestSchema>

export type UserServiceCreateInviteCodeOptions = EndpointCallOptions & {
  readonly request?: UserServiceCreateInviteCodeRequest
}

/**
 * Creates an invite code for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreateInviteCode
 */
export async function userServiceCreateInviteCode(
  options: UserServiceCreateInviteCodeOptions = {},
): PromiseResult<CreateInviteCodeResponse> {
  const op = "userServiceCreateInviteCode"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.createInviteCode(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

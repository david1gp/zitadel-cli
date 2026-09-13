import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  RegisterPasskeyRequestSchema,
  type RegisterPasskeyResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRegisterPasskeyRequest = MessageInitShape<typeof RegisterPasskeyRequestSchema>

export type UserServiceRegisterPasskeyOptions = EndpointCallOptions & {
  readonly request?: UserServiceRegisterPasskeyRequest
}

/**
 * Starts passkey registration for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RegisterPasskey
 */
export async function userServiceRegisterPasskey(
  options: UserServiceRegisterPasskeyOptions = {},
): PromiseResult<RegisterPasskeyResponse> {
  const op = "userServiceRegisterPasskey"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.registerPasskey(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

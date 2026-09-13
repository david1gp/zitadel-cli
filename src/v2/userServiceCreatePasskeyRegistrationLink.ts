import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  CreatePasskeyRegistrationLinkRequestSchema,
  type CreatePasskeyRegistrationLinkResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceCreatePasskeyRegistrationLinkRequest = MessageInitShape<
  typeof CreatePasskeyRegistrationLinkRequestSchema
>

export type UserServiceCreatePasskeyRegistrationLinkOptions = EndpointCallOptions & {
  readonly request?: UserServiceCreatePasskeyRegistrationLinkRequest
}

/**
 * Creates a passkey registration link or returns a registration code for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreatePasskeyRegistrationLink
 */
export async function userServiceCreatePasskeyRegistrationLink(
  options: UserServiceCreatePasskeyRegistrationLinkOptions = {},
): PromiseResult<CreatePasskeyRegistrationLinkResponse> {
  const op = "userServiceCreatePasskeyRegistrationLink"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.createPasskeyRegistrationLink(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

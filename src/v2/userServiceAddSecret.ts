import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddSecretRequestSchema, type AddSecretResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceAddSecretRequest = MessageInitShape<typeof AddSecretRequestSchema>

export type UserServiceAddSecretOptions = EndpointCallOptions & {
  readonly request?: UserServiceAddSecretRequest
}

/**
 * Adds a client secret to a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddSecret
 */
export async function userServiceAddSecret(
  options: UserServiceAddSecretOptions = {},
): PromiseResult<AddSecretResponse> {
  const op = "userServiceAddSecret"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.addSecret(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

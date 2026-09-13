import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveSecretRequestSchema, type RemoveSecretResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveSecretRequest = MessageInitShape<typeof RemoveSecretRequestSchema>

export type UserServiceRemoveSecretOptions = EndpointCallOptions & {
  readonly request?: UserServiceRemoveSecretRequest
}

/**
 * Removes the current client ID and client secret from a service account.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveSecret
 */
export async function userServiceRemoveSecret(
  options: UserServiceRemoveSecretOptions = {},
): PromiseResult<RemoveSecretResponse> {
  const op = "userServiceRemoveSecret"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.removeSecret(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

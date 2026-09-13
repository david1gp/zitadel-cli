import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  StartIdentityProviderIntentRequestSchema,
  type StartIdentityProviderIntentResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceStartIdentityProviderIntentRequest = MessageInitShape<
  typeof StartIdentityProviderIntentRequestSchema
>

export type UserServiceStartIdentityProviderIntentOptions = EndpointCallOptions & {
  readonly request?: UserServiceStartIdentityProviderIntentRequest
}

/**
 * Starts a flow with an identity provider for external login, registration, or linking.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.StartIdentityProviderIntent
 */
export async function userServiceStartIdentityProviderIntent(
  options: UserServiceStartIdentityProviderIntentOptions = {},
): PromiseResult<StartIdentityProviderIntentResponse> {
  const op = "userServiceStartIdentityProviderIntent"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.startIdentityProviderIntent(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  RetrieveIdentityProviderIntentRequestSchema,
  type RetrieveIdentityProviderIntentResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRetrieveIdentityProviderIntentRequest = MessageInitShape<
  typeof RetrieveIdentityProviderIntentRequestSchema
>

export type UserServiceRetrieveIdentityProviderIntentOptions = EndpointCallOptions & {
  readonly request?: UserServiceRetrieveIdentityProviderIntentRequest
}

/**
 * Retrieves the information returned by the identity provider for registration or updating an existing user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RetrieveIdentityProviderIntent
 */
export async function userServiceRetrieveIdentityProviderIntent(
  options: UserServiceRetrieveIdentityProviderIntentOptions = {},
): PromiseResult<RetrieveIdentityProviderIntentResponse> {
  const op = "userServiceRetrieveIdentityProviderIntent"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.retrieveIdentityProviderIntent(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

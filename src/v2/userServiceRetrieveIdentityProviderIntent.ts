import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  RetrieveIdentityProviderIntentRequestSchema,
  type RetrieveIdentityProviderIntentResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRetrieveIdentityProviderIntentRequest = MessageInitShape<
  typeof RetrieveIdentityProviderIntentRequestSchema
>

export type UserServiceRetrieveIdentityProviderIntentOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceRetrieveIdentityProviderIntentRequest
  readonly token?: string
  readonly transport?: Transport
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
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.retrieveIdentityProviderIntent(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

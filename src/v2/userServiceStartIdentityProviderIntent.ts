import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  StartIdentityProviderIntentRequestSchema,
  type StartIdentityProviderIntentResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceStartIdentityProviderIntentRequest = MessageInitShape<
  typeof StartIdentityProviderIntentRequestSchema
>

export type UserServiceStartIdentityProviderIntentOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceStartIdentityProviderIntentRequest
  readonly token?: string
  readonly transport?: Transport
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
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.startIdentityProviderIntent(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  RemovePersonalAccessTokenRequestSchema,
  type RemovePersonalAccessTokenResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemovePersonalAccessTokenRequest = MessageInitShape<
  typeof RemovePersonalAccessTokenRequestSchema
>

export type UserServiceRemovePersonalAccessTokenOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceRemovePersonalAccessTokenRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Removes a personal access token from a machine user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemovePersonalAccessToken
 */
export async function userServiceRemovePersonalAccessToken(
  options: UserServiceRemovePersonalAccessTokenOptions = {},
): PromiseResult<RemovePersonalAccessTokenResponse> {
  const op = "userServiceRemovePersonalAccessToken"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.removePersonalAccessToken(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

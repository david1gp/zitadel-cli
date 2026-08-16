import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  AddPersonalAccessTokenRequestSchema,
  type AddPersonalAccessTokenResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceAddPersonalAccessTokenRequest = MessageInitShape<typeof AddPersonalAccessTokenRequestSchema>

export type UserServiceAddPersonalAccessTokenOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceAddPersonalAccessTokenRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Adds a personal access token to a machine user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddPersonalAccessToken
 */
export async function userServiceAddPersonalAccessToken(
  options: UserServiceAddPersonalAccessTokenOptions = {},
): PromiseResult<AddPersonalAccessTokenResponse> {
  const op = "userServiceAddPersonalAccessToken"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.addPersonalAccessToken(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

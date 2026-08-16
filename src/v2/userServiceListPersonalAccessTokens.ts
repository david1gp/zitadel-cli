import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ListPersonalAccessTokensRequestSchema,
  type ListPersonalAccessTokensResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListPersonalAccessTokensRequest = MessageInitShape<typeof ListPersonalAccessTokensRequestSchema>

export type UserServiceListPersonalAccessTokensOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceListPersonalAccessTokensRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists personal access tokens visible to the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListPersonalAccessTokens
 */
export async function userServiceListPersonalAccessTokens(
  options: UserServiceListPersonalAccessTokensOptions = {},
): PromiseResult<ListPersonalAccessTokensResponse> {
  const op = "userServiceListPersonalAccessTokens"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listPersonalAccessTokens(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

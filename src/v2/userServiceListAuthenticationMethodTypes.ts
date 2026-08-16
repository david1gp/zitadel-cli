import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ListAuthenticationMethodTypesRequestSchema,
  type ListAuthenticationMethodTypesResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListAuthenticationMethodTypesRequest = MessageInitShape<
  typeof ListAuthenticationMethodTypesRequestSchema
>

export type UserServiceListAuthenticationMethodTypesOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceListAuthenticationMethodTypesRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists the authentication method types available to a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListAuthenticationMethodTypes
 */
export async function userServiceListAuthenticationMethodTypes(
  options: UserServiceListAuthenticationMethodTypesOptions = {},
): PromiseResult<ListAuthenticationMethodTypesResponse> {
  const op = "userServiceListAuthenticationMethodTypes"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listAuthenticationMethodTypes(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

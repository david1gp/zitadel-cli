import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ListAuthenticationFactorsRequestSchema,
  type ListAuthenticationFactorsResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListAuthenticationFactorsRequest = MessageInitShape<
  typeof ListAuthenticationFactorsRequestSchema
>

export type UserServiceListAuthenticationFactorsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceListAuthenticationFactorsRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists authentication factors for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListAuthenticationFactors
 */
export async function userServiceListAuthenticationFactors(
  options: UserServiceListAuthenticationFactorsOptions = {},
): PromiseResult<ListAuthenticationFactorsResponse> {
  const op = "userServiceListAuthenticationFactors"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listAuthenticationFactors(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

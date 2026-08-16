import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { ListPasskeysRequestSchema, type ListPasskeysResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListPasskeysRequest = MessageInitShape<typeof ListPasskeysRequestSchema>

export type UserServiceListPasskeysOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceListPasskeysRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists passkeys for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListPasskeys
 */
export async function userServiceListPasskeys(
  options: UserServiceListPasskeysOptions = {},
): PromiseResult<ListPasskeysResponse> {
  const op = "userServiceListPasskeys"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listPasskeys(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

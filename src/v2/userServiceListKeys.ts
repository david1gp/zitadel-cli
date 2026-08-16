import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { ListKeysRequestSchema, type ListKeysResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListKeysRequest = MessageInitShape<typeof ListKeysRequestSchema>

export type UserServiceListKeysOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceListKeysRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists user keys matching the request parameters.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListKeys
 */
export async function userServiceListKeys(options: UserServiceListKeysOptions = {}): PromiseResult<ListKeysResponse> {
  const op = "userServiceListKeys"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listKeys(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

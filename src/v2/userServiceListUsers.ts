import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { ListUsersRequestSchema, type ListUsersResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListUsersRequest = MessageInitShape<typeof ListUsersRequestSchema>

export type UserServiceListUsersOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceListUsersRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists users visible to the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListUsers
 */
export async function userServiceListUsers(
  options: UserServiceListUsersOptions = {},
): PromiseResult<ListUsersResponse> {
  const op = "userServiceListUsers"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listUsers(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

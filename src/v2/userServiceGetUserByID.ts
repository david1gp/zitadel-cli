import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { GetUserByIDRequestSchema, type GetUserByIDResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceGetUserByIDRequest = MessageInitShape<typeof GetUserByIDRequestSchema>

export type UserServiceGetUserByIDOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceGetUserByIDRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Returns the user identified by the requested ID.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.GetUserByID
 */
export async function userServiceGetUserByID(
  options: UserServiceGetUserByIDOptions = {},
): PromiseResult<GetUserByIDResponse> {
  const op = "userServiceGetUserByID"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.getUserByID(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

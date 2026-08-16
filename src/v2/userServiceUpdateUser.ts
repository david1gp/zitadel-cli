import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { UpdateUserRequestSchema, type UpdateUserResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceUpdateUserRequest = MessageInitShape<typeof UpdateUserRequestSchema>

export type UserServiceUpdateUserOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceUpdateUserRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Partially updates a user for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.UpdateUser
 */
export async function userServiceUpdateUser(
  options: UserServiceUpdateUserOptions = {},
): PromiseResult<UpdateUserResponse> {
  const op = "userServiceUpdateUser"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.updateUser(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

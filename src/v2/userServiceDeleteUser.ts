import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { DeleteUserRequestSchema, type DeleteUserResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceDeleteUserRequest = MessageInitShape<typeof DeleteUserRequestSchema>

export type UserServiceDeleteUserOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceDeleteUserRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Deletes an existing user for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.DeleteUser
 */
export async function userServiceDeleteUser(
  options: UserServiceDeleteUserOptions = {},
): PromiseResult<DeleteUserResponse> {
  const op = "userServiceDeleteUser"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deleteUser(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

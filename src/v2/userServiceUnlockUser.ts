import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { UnlockUserRequestSchema, type UnlockUserResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceUnlockUserRequest = MessageInitShape<typeof UnlockUserRequestSchema>

export type UserServiceUnlockUserOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceUnlockUserRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Unlocks a locked user for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.UnlockUser
 */
export async function userServiceUnlockUser(
  options: UserServiceUnlockUserOptions = {},
): PromiseResult<UnlockUserResponse> {
  const op = "userServiceUnlockUser"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.unlockUser(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

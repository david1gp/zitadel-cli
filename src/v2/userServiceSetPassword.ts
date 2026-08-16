import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { SetPasswordRequestSchema, type SetPasswordResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceSetPasswordRequest = MessageInitShape<typeof SetPasswordRequestSchema>

export type UserServiceSetPasswordOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceSetPasswordRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Changes a user's password with either the current password or a verification code.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.SetPassword
 */
export async function userServiceSetPassword(
  options: UserServiceSetPasswordOptions = {},
): PromiseResult<SetPasswordResponse> {
  const op = "userServiceSetPassword"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.setPassword(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

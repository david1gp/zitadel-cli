import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { RegisterU2FRequestSchema, type RegisterU2FResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRegisterU2FRequest = MessageInitShape<typeof RegisterU2FRequestSchema>

export type UserServiceRegisterU2FOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceRegisterU2FRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Starts U2F registration for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RegisterU2F
 */
export async function userServiceRegisterU2F(
  options: UserServiceRegisterU2FOptions = {},
): PromiseResult<RegisterU2FResponse> {
  const op = "userServiceRegisterU2F"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.registerU2F(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

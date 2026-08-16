import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { RemoveTOTPRequestSchema, type RemoveTOTPResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveTOTPRequest = MessageInitShape<typeof RemoveTOTPRequestSchema>

export type UserServiceRemoveTOTPOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceRemoveTOTPRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Removes the configured TOTP generator from a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveTOTP
 */
export async function userServiceRemoveTOTP(
  options: UserServiceRemoveTOTPOptions = {},
): PromiseResult<RemoveTOTPResponse> {
  const op = "userServiceRemoveTOTP"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.removeTOTP(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

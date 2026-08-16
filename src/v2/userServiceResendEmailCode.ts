import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ResendEmailCodeRequestSchema,
  type ResendEmailCodeResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceResendEmailCodeRequest = MessageInitShape<typeof ResendEmailCodeRequestSchema>

export type UserServiceResendEmailCodeOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceResendEmailCodeRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Resends the code used to verify a user's email address.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ResendEmailCode
 */
export async function userServiceResendEmailCode(
  options: UserServiceResendEmailCodeOptions = {},
): PromiseResult<ResendEmailCodeResponse> {
  const op = "userServiceResendEmailCode"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.resendEmailCode(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

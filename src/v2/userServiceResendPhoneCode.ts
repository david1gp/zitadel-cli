import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ResendPhoneCodeRequestSchema,
  type ResendPhoneCodeResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceResendPhoneCodeRequest = MessageInitShape<typeof ResendPhoneCodeRequestSchema>

export type UserServiceResendPhoneCodeOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceResendPhoneCodeRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Resends a phone verification code for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ResendPhoneCode
 */
export async function userServiceResendPhoneCode(
  options: UserServiceResendPhoneCodeOptions = {},
): PromiseResult<ResendPhoneCodeResponse> {
  const op = "userServiceResendPhoneCode"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.resendPhoneCode(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

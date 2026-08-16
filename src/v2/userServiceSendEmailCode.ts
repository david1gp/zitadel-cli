import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { SendEmailCodeRequestSchema, type SendEmailCodeResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceSendEmailCodeRequest = MessageInitShape<typeof SendEmailCodeRequestSchema>

export type UserServiceSendEmailCodeOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceSendEmailCodeRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Sends a code to verify a user's email address.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.SendEmailCode
 */
export async function userServiceSendEmailCode(
  options: UserServiceSendEmailCodeOptions = {},
): PromiseResult<SendEmailCodeResponse> {
  const op = "userServiceSendEmailCode"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.sendEmailCode(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

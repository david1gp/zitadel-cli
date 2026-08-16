import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { VerifyEmailRequestSchema, type VerifyEmailResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceVerifyEmailRequest = MessageInitShape<typeof VerifyEmailRequestSchema>

export type UserServiceVerifyEmailOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceVerifyEmailRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Verifies a user's email address with the provided verification code.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyEmail
 */
export async function userServiceVerifyEmail(
  options: UserServiceVerifyEmailOptions = {},
): PromiseResult<VerifyEmailResponse> {
  const op = "userServiceVerifyEmail"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.verifyEmail(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

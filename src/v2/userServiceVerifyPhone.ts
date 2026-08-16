import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { VerifyPhoneRequestSchema, type VerifyPhoneResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceVerifyPhoneRequest = MessageInitShape<typeof VerifyPhoneRequestSchema>

export type UserServiceVerifyPhoneOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceVerifyPhoneRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Verifies a user's phone number with the generated verification code.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyPhone
 */
export async function userServiceVerifyPhone(
  options: UserServiceVerifyPhoneOptions = {},
): PromiseResult<VerifyPhoneResponse> {
  const op = "userServiceVerifyPhone"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.verifyPhone(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

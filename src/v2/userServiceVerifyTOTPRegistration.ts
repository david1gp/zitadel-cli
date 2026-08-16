import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  VerifyTOTPRegistrationRequestSchema,
  type VerifyTOTPRegistrationResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceVerifyTOTPRegistrationRequest = MessageInitShape<typeof VerifyTOTPRegistrationRequestSchema>

export type UserServiceVerifyTOTPRegistrationOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceVerifyTOTPRegistrationRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Verifies a user's TOTP registration with the provided code.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyTOTPRegistration
 */
export async function userServiceVerifyTOTPRegistration(
  options: UserServiceVerifyTOTPRegistrationOptions = {},
): PromiseResult<VerifyTOTPRegistrationResponse> {
  const op = "userServiceVerifyTOTPRegistration"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.verifyTOTPRegistration(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

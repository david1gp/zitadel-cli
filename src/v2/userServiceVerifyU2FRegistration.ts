import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  VerifyU2FRegistrationRequestSchema,
  type VerifyU2FRegistrationResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceVerifyU2FRegistrationRequest = MessageInitShape<typeof VerifyU2FRegistrationRequestSchema>

export type UserServiceVerifyU2FRegistrationOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceVerifyU2FRegistrationRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Verifies a U2F registration for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyU2FRegistration
 */
export async function userServiceVerifyU2FRegistration(
  options: UserServiceVerifyU2FRegistrationOptions = {},
): PromiseResult<VerifyU2FRegistrationResponse> {
  const op = "userServiceVerifyU2FRegistration"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.verifyU2FRegistration(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

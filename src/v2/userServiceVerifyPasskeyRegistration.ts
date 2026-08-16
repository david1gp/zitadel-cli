import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  VerifyPasskeyRegistrationRequestSchema,
  type VerifyPasskeyRegistrationResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceVerifyPasskeyRegistrationRequest = MessageInitShape<
  typeof VerifyPasskeyRegistrationRequestSchema
>

export type UserServiceVerifyPasskeyRegistrationOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceVerifyPasskeyRegistrationRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Verifies a passkey registration for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyPasskeyRegistration
 */
export async function userServiceVerifyPasskeyRegistration(
  options: UserServiceVerifyPasskeyRegistrationOptions = {},
): PromiseResult<VerifyPasskeyRegistrationResponse> {
  const op = "userServiceVerifyPasskeyRegistration"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.verifyPasskeyRegistration(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

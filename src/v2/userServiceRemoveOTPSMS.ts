import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { RemoveOTPSMSRequestSchema, type RemoveOTPSMSResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveOTPSMSRequest = MessageInitShape<typeof RemoveOTPSMSRequestSchema>

export type UserServiceRemoveOTPSMSOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceRemoveOTPSMSRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Removes a user's configured SMS-based OTP factor.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveOTPSMS
 */
export async function userServiceRemoveOTPSMS(
  options: UserServiceRemoveOTPSMSOptions = {},
): PromiseResult<RemoveOTPSMSResponse> {
  const op = "userServiceRemoveOTPSMS"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.removeOTPSMS(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

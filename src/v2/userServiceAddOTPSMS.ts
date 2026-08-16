import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { AddOTPSMSRequestSchema, type AddOTPSMSResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceAddOTPSMSRequest = MessageInitShape<typeof AddOTPSMSRequestSchema>

export type UserServiceAddOTPSMSOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceAddOTPSMSRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Adds SMS-based OTP authentication for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddOTPSMS
 */
export async function userServiceAddOTPSMS(
  options: UserServiceAddOTPSMSOptions = {},
): PromiseResult<AddOTPSMSResponse> {
  const op = "userServiceAddOTPSMS"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.addOTPSMS(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { AddOTPEmailRequestSchema, type AddOTPEmailResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceAddOTPEmailRequest = MessageInitShape<typeof AddOTPEmailRequestSchema>

export type UserServiceAddOTPEmailOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceAddOTPEmailRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Adds an OTP email factor to a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddOTPEmail
 */
export async function userServiceAddOTPEmail(
  options: UserServiceAddOTPEmailOptions = {},
): PromiseResult<AddOTPEmailResponse> {
  const op = "userServiceAddOTPEmail"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.addOTPEmail(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

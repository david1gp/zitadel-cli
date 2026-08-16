import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  RemoveOTPEmailRequestSchema,
  type RemoveOTPEmailResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveOTPEmailRequest = MessageInitShape<typeof RemoveOTPEmailRequestSchema>

export type UserServiceRemoveOTPEmailOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceRemoveOTPEmailRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Removes a user's configured OTP email factor.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveOTPEmail
 */
export async function userServiceRemoveOTPEmail(
  options: UserServiceRemoveOTPEmailOptions = {},
): PromiseResult<RemoveOTPEmailResponse> {
  const op = "userServiceRemoveOTPEmail"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.removeOTPEmail(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  RegisterPasskeyRequestSchema,
  type RegisterPasskeyResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRegisterPasskeyRequest = MessageInitShape<typeof RegisterPasskeyRequestSchema>

export type UserServiceRegisterPasskeyOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceRegisterPasskeyRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Starts passkey registration for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RegisterPasskey
 */
export async function userServiceRegisterPasskey(
  options: UserServiceRegisterPasskeyOptions = {},
): PromiseResult<RegisterPasskeyResponse> {
  const op = "userServiceRegisterPasskey"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.registerPasskey(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  VerifyInviteCodeRequestSchema,
  type VerifyInviteCodeResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceVerifyInviteCodeRequest = MessageInitShape<typeof VerifyInviteCodeRequestSchema>

export type UserServiceVerifyInviteCodeOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceVerifyInviteCodeRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Verifies a user's invite code and enables initial authentication setup.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyInviteCode
 */
export async function userServiceVerifyInviteCode(
  options: UserServiceVerifyInviteCodeOptions = {},
): PromiseResult<VerifyInviteCodeResponse> {
  const op = "userServiceVerifyInviteCode"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.verifyInviteCode(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  CreateInviteCodeRequestSchema,
  type CreateInviteCodeResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceCreateInviteCodeRequest = MessageInitShape<typeof CreateInviteCodeRequestSchema>

export type UserServiceCreateInviteCodeOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceCreateInviteCodeRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Creates an invite code for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreateInviteCode
 */
export async function userServiceCreateInviteCode(
  options: UserServiceCreateInviteCodeOptions = {},
): PromiseResult<CreateInviteCodeResponse> {
  const op = "userServiceCreateInviteCode"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.createInviteCode(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

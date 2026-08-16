import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ReactivateUserRequestSchema,
  type ReactivateUserResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceReactivateUserRequest = MessageInitShape<typeof ReactivateUserRequestSchema>

export type UserServiceReactivateUserOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceReactivateUserRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Reactivates a deactivated user for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ReactivateUser
 */
export async function userServiceReactivateUser(
  options: UserServiceReactivateUserOptions = {},
): PromiseResult<ReactivateUserResponse> {
  const op = "userServiceReactivateUser"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.reactivateUser(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

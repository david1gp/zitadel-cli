import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  DeactivateUserRequestSchema,
  type DeactivateUserResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceDeactivateUserRequest = MessageInitShape<typeof DeactivateUserRequestSchema>

export type UserServiceDeactivateUserOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceDeactivateUserRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Deactivates a user for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.DeactivateUser
 */
export async function userServiceDeactivateUser(
  options: UserServiceDeactivateUserOptions = {},
): PromiseResult<DeactivateUserResponse> {
  const op = "userServiceDeactivateUser"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deactivateUser(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

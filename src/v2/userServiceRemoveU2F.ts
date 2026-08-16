import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { RemoveU2FRequestSchema, type RemoveU2FResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveU2FRequest = MessageInitShape<typeof RemoveU2FRequestSchema>

export type UserServiceRemoveU2FOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceRemoveU2FRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Removes a U2F authenticator for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveU2F
 */
export async function userServiceRemoveU2F(
  options: UserServiceRemoveU2FOptions = {},
): PromiseResult<RemoveU2FResponse> {
  const op = "userServiceRemoveU2F"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.removeU2F(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

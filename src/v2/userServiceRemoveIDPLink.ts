import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { RemoveIDPLinkRequestSchema, type RemoveIDPLinkResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveIDPLinkRequest = MessageInitShape<typeof RemoveIDPLinkRequestSchema>

export type UserServiceRemoveIDPLinkOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceRemoveIDPLinkRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Removes an identity provider link from a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveIDPLink
 */
export async function userServiceRemoveIDPLink(
  options: UserServiceRemoveIDPLinkOptions = {},
): PromiseResult<RemoveIDPLinkResponse> {
  const op = "userServiceRemoveIDPLink"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.removeIDPLink(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

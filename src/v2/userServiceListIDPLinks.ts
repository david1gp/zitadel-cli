import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { ListIDPLinksRequestSchema, type ListIDPLinksResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListIDPLinksRequest = MessageInitShape<typeof ListIDPLinksRequestSchema>

export type UserServiceListIDPLinksOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceListIDPLinksRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists identity provider links for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListIDPLinks
 */
export async function userServiceListIDPLinks(
  options: UserServiceListIDPLinksOptions = {},
): PromiseResult<ListIDPLinksResponse> {
  const op = "userServiceListIDPLinks"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listIDPLinks(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { AddIDPLinkRequestSchema, type AddIDPLinkResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceAddIDPLinkRequest = MessageInitShape<typeof AddIDPLinkRequestSchema>

export type UserServiceAddIDPLinkOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceAddIDPLinkRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Adds an identity provider link to a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddIDPLink
 */
export async function userServiceAddIDPLink(
  options: UserServiceAddIDPLinkOptions = {},
): PromiseResult<AddIDPLinkResponse> {
  const op = "userServiceAddIDPLink"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.addIDPLink(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ListUserMetadataRequestSchema,
  type ListUserMetadataResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListUserMetadataRequest = MessageInitShape<typeof ListUserMetadataRequestSchema>

export type UserServiceListUserMetadataOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceListUserMetadataRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists metadata stored for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListUserMetadata
 */
export async function userServiceListUserMetadata(
  options: UserServiceListUserMetadataOptions = {},
): PromiseResult<ListUserMetadataResponse> {
  const op = "userServiceListUserMetadata"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listUserMetadata(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

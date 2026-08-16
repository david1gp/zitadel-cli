import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  SetUserMetadataRequestSchema,
  type SetUserMetadataResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceSetUserMetadataRequest = MessageInitShape<typeof SetUserMetadataRequestSchema>

export type UserServiceSetUserMetadataOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceSetUserMetadataRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Sets user metadata for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.SetUserMetadata
 */
export async function userServiceSetUserMetadata(
  options: UserServiceSetUserMetadataOptions = {},
): PromiseResult<SetUserMetadataResponse> {
  const op = "userServiceSetUserMetadata"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.setUserMetadata(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  DeleteUserMetadataRequestSchema,
  type DeleteUserMetadataResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceDeleteUserMetadataRequest = MessageInitShape<typeof DeleteUserMetadataRequestSchema>

export type UserServiceDeleteUserMetadataOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceDeleteUserMetadataRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Deletes selected metadata entries from a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.DeleteUserMetadata
 */
export async function userServiceDeleteUserMetadata(
  options: UserServiceDeleteUserMetadataOptions = {},
): PromiseResult<DeleteUserMetadataResponse> {
  const op = "userServiceDeleteUserMetadata"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deleteUserMetadata(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

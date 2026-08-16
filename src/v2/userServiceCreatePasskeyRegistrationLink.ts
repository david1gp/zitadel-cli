import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  CreatePasskeyRegistrationLinkRequestSchema,
  type CreatePasskeyRegistrationLinkResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceCreatePasskeyRegistrationLinkRequest = MessageInitShape<
  typeof CreatePasskeyRegistrationLinkRequestSchema
>

export type UserServiceCreatePasskeyRegistrationLinkOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceCreatePasskeyRegistrationLinkRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Creates a passkey registration link or returns a registration code for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreatePasskeyRegistrationLink
 */
export async function userServiceCreatePasskeyRegistrationLink(
  options: UserServiceCreatePasskeyRegistrationLinkOptions = {},
): PromiseResult<CreatePasskeyRegistrationLinkResponse> {
  const op = "userServiceCreatePasskeyRegistrationLink"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.createPasskeyRegistrationLink(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

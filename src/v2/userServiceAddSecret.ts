import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { AddSecretRequestSchema, type AddSecretResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceAddSecretRequest = MessageInitShape<typeof AddSecretRequestSchema>

export type UserServiceAddSecretOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceAddSecretRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Adds a client secret to a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddSecret
 */
export async function userServiceAddSecret(
  options: UserServiceAddSecretOptions = {},
): PromiseResult<AddSecretResponse> {
  const op = "userServiceAddSecret"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.addSecret(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

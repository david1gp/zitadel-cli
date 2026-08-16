import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { RemoveSecretRequestSchema, type RemoveSecretResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveSecretRequest = MessageInitShape<typeof RemoveSecretRequestSchema>

export type UserServiceRemoveSecretOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceRemoveSecretRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Removes the current client ID and client secret from a service account.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveSecret
 */
export async function userServiceRemoveSecret(
  options: UserServiceRemoveSecretOptions = {},
): PromiseResult<RemoveSecretResponse> {
  const op = "userServiceRemoveSecret"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.removeSecret(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

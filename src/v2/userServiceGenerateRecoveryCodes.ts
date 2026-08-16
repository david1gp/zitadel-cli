import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  GenerateRecoveryCodesRequestSchema,
  type GenerateRecoveryCodesResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceGenerateRecoveryCodesRequest = MessageInitShape<typeof GenerateRecoveryCodesRequestSchema>

export type UserServiceGenerateRecoveryCodesOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceGenerateRecoveryCodesRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Generates recovery codes for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.GenerateRecoveryCodes
 */
export async function userServiceGenerateRecoveryCodes(
  options: UserServiceGenerateRecoveryCodesOptions = {},
): PromiseResult<GenerateRecoveryCodesResponse> {
  const op = "userServiceGenerateRecoveryCodes"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.generateRecoveryCodes(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

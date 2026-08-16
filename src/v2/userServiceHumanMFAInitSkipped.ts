import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  HumanMFAInitSkippedRequestSchema,
  type HumanMFAInitSkippedResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceHumanMFAInitSkippedRequest = MessageInitShape<typeof HumanMFAInitSkippedRequestSchema>

export type UserServiceHumanMFAInitSkippedOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceHumanMFAInitSkippedRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Marks the initial human MFA setup as skipped for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.HumanMFAInitSkipped
 */
export async function userServiceHumanMFAInitSkipped(
  options: UserServiceHumanMFAInitSkippedOptions = {},
): PromiseResult<HumanMFAInitSkippedResponse> {
  const op = "userServiceHumanMFAInitSkipped"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.humanMFAInitSkipped(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

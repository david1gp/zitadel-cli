import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  HumanMFAInitSkippedRequestSchema,
  type HumanMFAInitSkippedResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceHumanMFAInitSkippedRequest = MessageInitShape<typeof HumanMFAInitSkippedRequestSchema>

export type UserServiceHumanMFAInitSkippedOptions = EndpointCallOptions & {
  readonly request?: UserServiceHumanMFAInitSkippedRequest
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
    ...options,
    invoke: (client, request) => client.humanMFAInitSkipped(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  RemoveRecoveryCodesRequestSchema,
  type RemoveRecoveryCodesResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceRemoveRecoveryCodesRequest = MessageInitShape<typeof RemoveRecoveryCodesRequestSchema>

export type UserServiceRemoveRecoveryCodesOptions = EndpointCallOptions & {
  readonly request?: UserServiceRemoveRecoveryCodesRequest
}

/**
 * Removes all recovery codes from the authenticated user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveRecoveryCodes
 */
export async function userServiceRemoveRecoveryCodes(
  options: UserServiceRemoveRecoveryCodesOptions = {},
): PromiseResult<RemoveRecoveryCodesResponse> {
  const op = "userServiceRemoveRecoveryCodes"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.removeRecoveryCodes(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

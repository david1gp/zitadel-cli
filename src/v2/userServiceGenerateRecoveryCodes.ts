import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  GenerateRecoveryCodesRequestSchema,
  type GenerateRecoveryCodesResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceGenerateRecoveryCodesRequest = MessageInitShape<typeof GenerateRecoveryCodesRequestSchema>

export type UserServiceGenerateRecoveryCodesOptions = EndpointCallOptions & {
  readonly request?: UserServiceGenerateRecoveryCodesRequest
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
    ...options,
    invoke: (client, request) => client.generateRecoveryCodes(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  SetUserMetadataRequestSchema,
  type SetUserMetadataResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceSetUserMetadataRequest = MessageInitShape<typeof SetUserMetadataRequestSchema>

export type UserServiceSetUserMetadataOptions = EndpointCallOptions & {
  readonly request?: UserServiceSetUserMetadataRequest
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
    ...options,
    invoke: (client, request) => client.setUserMetadata(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

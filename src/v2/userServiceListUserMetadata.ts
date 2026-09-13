import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ListUserMetadataRequestSchema,
  type ListUserMetadataResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceListUserMetadataRequest = MessageInitShape<typeof ListUserMetadataRequestSchema>

export type UserServiceListUserMetadataOptions = EndpointCallOptions & {
  readonly request?: UserServiceListUserMetadataRequest
}

/**
 * Lists metadata stored for a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListUserMetadata
 */
export async function userServiceListUserMetadata(
  options: UserServiceListUserMetadataOptions = {},
): PromiseResult<ListUserMetadataResponse> {
  const op = "userServiceListUserMetadata"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listUserMetadata(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  DeleteUserMetadataRequestSchema,
  type DeleteUserMetadataResponse,
} from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceDeleteUserMetadataRequest = MessageInitShape<typeof DeleteUserMetadataRequestSchema>

export type UserServiceDeleteUserMetadataOptions = EndpointCallOptions & {
  readonly request?: UserServiceDeleteUserMetadataRequest
}

/**
 * Deletes selected metadata entries from a user.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.DeleteUserMetadata
 */
export async function userServiceDeleteUserMetadata(
  options: UserServiceDeleteUserMetadataOptions = {},
): PromiseResult<DeleteUserMetadataResponse> {
  const op = "userServiceDeleteUserMetadata"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deleteUserMetadata(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}

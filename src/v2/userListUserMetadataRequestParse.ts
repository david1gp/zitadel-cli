import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListUserMetadataRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserListUserMetadataRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserListUserMetadataRequest = MessageInitShape<typeof ListUserMetadataRequestSchema>

export async function userListUserMetadataRequestParse(
  options: UserListUserMetadataRequestParseOptions = {},
): PromiseResult<UserListUserMetadataRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userListUserMetadataRequestParse",
    schema: ListUserMetadataRequestSchema,
  })
}

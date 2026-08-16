import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeleteUserMetadataRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserDeleteUserMetadataRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserDeleteUserMetadataRequest = MessageInitShape<typeof DeleteUserMetadataRequestSchema>

export async function userDeleteUserMetadataRequestParse(
  options: UserDeleteUserMetadataRequestParseOptions = {},
): PromiseResult<UserDeleteUserMetadataRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userDeleteUserMetadataRequestParse",
    schema: DeleteUserMetadataRequestSchema,
  })
}

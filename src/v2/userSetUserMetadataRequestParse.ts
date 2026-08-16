import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { SetUserMetadataRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserSetUserMetadataRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserSetUserMetadataRequest = MessageInitShape<typeof SetUserMetadataRequestSchema>

export async function userSetUserMetadataRequestParse(
  options: UserSetUserMetadataRequestParseOptions = {},
): PromiseResult<UserSetUserMetadataRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userSetUserMetadataRequestParse",
    schema: SetUserMetadataRequestSchema,
  })
}

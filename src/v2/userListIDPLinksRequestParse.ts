import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListIDPLinksRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserListIDPLinksRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserListIDPLinksRequest = MessageInitShape<typeof ListIDPLinksRequestSchema>

export async function userListIDPLinksRequestParse(
  options: UserListIDPLinksRequestParseOptions = {},
): PromiseResult<UserListIDPLinksRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userListIDPLinksRequestParse",
    schema: ListIDPLinksRequestSchema,
  })
}

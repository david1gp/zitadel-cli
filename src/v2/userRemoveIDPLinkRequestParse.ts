import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveIDPLinkRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRemoveIDPLinkRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRemoveIDPLinkRequest = MessageInitShape<typeof RemoveIDPLinkRequestSchema>

export async function userRemoveIDPLinkRequestParse(
  options: UserRemoveIDPLinkRequestParseOptions = {},
): PromiseResult<UserRemoveIDPLinkRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRemoveIDPLinkRequestParse",
    schema: RemoveIDPLinkRequestSchema,
  })
}

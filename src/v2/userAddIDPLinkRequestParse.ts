import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddIDPLinkRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserAddIDPLinkRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserAddIDPLinkRequest = MessageInitShape<typeof AddIDPLinkRequestSchema>

export async function userAddIDPLinkRequestParse(
  options: UserAddIDPLinkRequestParseOptions = {},
): PromiseResult<UserAddIDPLinkRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userAddIDPLinkRequestParse",
    schema: AddIDPLinkRequestSchema,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListIDPsRequestSchema } from "../generated/zitadel/admin_pb.js"
import { endpointRequestParse } from "../v2/internal/endpointRequestParse.js"

type AdminListIDPsRequestParseOptions = {
  readonly file?: string
  readonly json?: string
}

export type AdminListIDPsRequest = MessageInitShape<typeof ListIDPsRequestSchema>

export async function adminListIDPsRequestParse(
  options: AdminListIDPsRequestParseOptions = {},
): PromiseResult<AdminListIDPsRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "adminListIDPsRequestParse",
    schema: ListIDPsRequestSchema,
  })
}

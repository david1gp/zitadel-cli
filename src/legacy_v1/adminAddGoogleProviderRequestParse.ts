import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddGoogleProviderRequestSchema } from "../generated/zitadel/admin_pb.js"
import { endpointRequestParse } from "../v2/internal/endpointRequestParse.js"

type AdminAddGoogleProviderRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type AdminAddGoogleProviderRequest = MessageInitShape<typeof AddGoogleProviderRequestSchema>

export async function adminAddGoogleProviderRequestParse(
  options: AdminAddGoogleProviderRequestParseOptions = {},
): PromiseResult<AdminAddGoogleProviderRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "adminAddGoogleProviderRequestParse",
    schema: AddGoogleProviderRequestSchema,
  })
}

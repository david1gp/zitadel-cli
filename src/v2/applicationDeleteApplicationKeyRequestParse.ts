import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeleteApplicationKeyRequestSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ApplicationDeleteApplicationKeyRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ApplicationDeleteApplicationKeyRequest = MessageInitShape<typeof DeleteApplicationKeyRequestSchema>

export async function applicationDeleteApplicationKeyRequestParse(
  options: ApplicationDeleteApplicationKeyRequestParseOptions = {},
): PromiseResult<ApplicationDeleteApplicationKeyRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "applicationDeleteApplicationKeyRequestParse",
    schema: DeleteApplicationKeyRequestSchema,
  })
}

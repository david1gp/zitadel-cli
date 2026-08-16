import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { GetApplicationKeyRequestSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ApplicationGetApplicationKeyRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ApplicationGetApplicationKeyRequest = MessageInitShape<typeof GetApplicationKeyRequestSchema>

export async function applicationGetApplicationKeyRequestParse(
  options: ApplicationGetApplicationKeyRequestParseOptions = {},
): PromiseResult<ApplicationGetApplicationKeyRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "applicationGetApplicationKeyRequestParse",
    schema: GetApplicationKeyRequestSchema,
  })
}

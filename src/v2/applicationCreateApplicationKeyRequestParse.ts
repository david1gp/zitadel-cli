import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { CreateApplicationKeyRequestSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ApplicationCreateApplicationKeyRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ApplicationCreateApplicationKeyRequest = MessageInitShape<typeof CreateApplicationKeyRequestSchema>

export async function applicationCreateApplicationKeyRequestParse(
  options: ApplicationCreateApplicationKeyRequestParseOptions = {},
): PromiseResult<ApplicationCreateApplicationKeyRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "applicationCreateApplicationKeyRequestParse",
    schema: CreateApplicationKeyRequestSchema,
  })
}

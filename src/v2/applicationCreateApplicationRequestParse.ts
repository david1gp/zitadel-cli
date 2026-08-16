import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { CreateApplicationRequestSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ApplicationCreateApplicationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ApplicationCreateApplicationRequest = MessageInitShape<typeof CreateApplicationRequestSchema>

export async function applicationCreateApplicationRequestParse(
  options: ApplicationCreateApplicationRequestParseOptions = {},
): PromiseResult<ApplicationCreateApplicationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "applicationCreateApplicationRequestParse",
    schema: CreateApplicationRequestSchema,
  })
}

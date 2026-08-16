import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { GetApplicationRequestSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ApplicationGetApplicationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ApplicationGetApplicationRequest = MessageInitShape<typeof GetApplicationRequestSchema>

export async function applicationGetApplicationRequestParse(
  options: ApplicationGetApplicationRequestParseOptions = {},
): PromiseResult<ApplicationGetApplicationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "applicationGetApplicationRequestParse",
    schema: GetApplicationRequestSchema,
  })
}

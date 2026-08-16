import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeleteApplicationRequestSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ApplicationDeleteApplicationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ApplicationDeleteApplicationRequest = MessageInitShape<typeof DeleteApplicationRequestSchema>

export async function applicationDeleteApplicationRequestParse(
  options: ApplicationDeleteApplicationRequestParseOptions = {},
): PromiseResult<ApplicationDeleteApplicationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "applicationDeleteApplicationRequestParse",
    schema: DeleteApplicationRequestSchema,
  })
}

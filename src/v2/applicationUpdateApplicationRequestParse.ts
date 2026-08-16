import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { UpdateApplicationRequestSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ApplicationUpdateApplicationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ApplicationUpdateApplicationRequest = MessageInitShape<typeof UpdateApplicationRequestSchema>

export async function applicationUpdateApplicationRequestParse(
  options: ApplicationUpdateApplicationRequestParseOptions = {},
): PromiseResult<ApplicationUpdateApplicationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "applicationUpdateApplicationRequestParse",
    schema: UpdateApplicationRequestSchema,
  })
}

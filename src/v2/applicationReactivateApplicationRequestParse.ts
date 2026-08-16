import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ReactivateApplicationRequestSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ApplicationReactivateApplicationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ApplicationReactivateApplicationRequest = MessageInitShape<typeof ReactivateApplicationRequestSchema>

export async function applicationReactivateApplicationRequestParse(
  options: ApplicationReactivateApplicationRequestParseOptions = {},
): PromiseResult<ApplicationReactivateApplicationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "applicationReactivateApplicationRequestParse",
    schema: ReactivateApplicationRequestSchema,
  })
}

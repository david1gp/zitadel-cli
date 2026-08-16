import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeactivateApplicationRequestSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ApplicationDeactivateApplicationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ApplicationDeactivateApplicationRequest = MessageInitShape<typeof DeactivateApplicationRequestSchema>

export async function applicationDeactivateApplicationRequestParse(
  options: ApplicationDeactivateApplicationRequestParseOptions = {},
): PromiseResult<ApplicationDeactivateApplicationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "applicationDeactivateApplicationRequestParse",
    schema: DeactivateApplicationRequestSchema,
  })
}

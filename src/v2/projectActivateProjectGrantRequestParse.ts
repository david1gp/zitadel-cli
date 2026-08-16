import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ActivateProjectGrantRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectActivateProjectGrantRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectActivateProjectGrantRequest = MessageInitShape<typeof ActivateProjectGrantRequestSchema>

export async function projectActivateProjectGrantRequestParse(
  options: ProjectActivateProjectGrantRequestParseOptions = {},
): PromiseResult<ProjectActivateProjectGrantRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectActivateProjectGrantRequestParse",
    schema: ActivateProjectGrantRequestSchema,
  })
}

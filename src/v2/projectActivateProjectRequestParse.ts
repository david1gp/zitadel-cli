import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ActivateProjectRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectActivateProjectRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectActivateProjectRequest = MessageInitShape<typeof ActivateProjectRequestSchema>

export async function projectActivateProjectRequestParse(
  options: ProjectActivateProjectRequestParseOptions = {},
): PromiseResult<ProjectActivateProjectRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectActivateProjectRequestParse",
    schema: ActivateProjectRequestSchema,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { UpdateProjectRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectUpdateProjectRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectUpdateProjectRequest = MessageInitShape<typeof UpdateProjectRequestSchema>

export async function projectUpdateProjectRequestParse(
  options: ProjectUpdateProjectRequestParseOptions = {},
): PromiseResult<ProjectUpdateProjectRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectUpdateProjectRequestParse",
    schema: UpdateProjectRequestSchema,
  })
}

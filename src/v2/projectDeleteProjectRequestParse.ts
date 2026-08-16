import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeleteProjectRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectDeleteProjectRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectDeleteProjectRequest = MessageInitShape<typeof DeleteProjectRequestSchema>

export async function projectDeleteProjectRequestParse(
  options: ProjectDeleteProjectRequestParseOptions = {},
): PromiseResult<ProjectDeleteProjectRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectDeleteProjectRequestParse",
    schema: DeleteProjectRequestSchema,
  })
}

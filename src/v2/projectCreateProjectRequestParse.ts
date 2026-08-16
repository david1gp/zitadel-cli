import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { CreateProjectRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectCreateProjectRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectCreateProjectRequest = MessageInitShape<typeof CreateProjectRequestSchema>

export async function projectCreateProjectRequestParse(
  options: ProjectCreateProjectRequestParseOptions = {},
): PromiseResult<ProjectCreateProjectRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectCreateProjectRequestParse",
    schema: CreateProjectRequestSchema,
  })
}

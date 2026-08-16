import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { GetProjectRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectGetProjectRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectGetProjectRequest = MessageInitShape<typeof GetProjectRequestSchema>

export async function projectGetProjectRequestParse(
  options: ProjectGetProjectRequestParseOptions = {},
): PromiseResult<ProjectGetProjectRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectGetProjectRequestParse",
    schema: GetProjectRequestSchema,
  })
}

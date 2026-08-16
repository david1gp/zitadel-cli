import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListProjectsRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectListProjectsRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectListProjectsRequest = MessageInitShape<typeof ListProjectsRequestSchema>

export async function projectListProjectsRequestParse(
  options: ProjectListProjectsRequestParseOptions = {},
): PromiseResult<ProjectListProjectsRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectListProjectsRequestParse",
    schema: ListProjectsRequestSchema,
  })
}

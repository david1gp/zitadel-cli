import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListProjectGrantsRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectListProjectGrantsRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectListProjectGrantsRequest = MessageInitShape<typeof ListProjectGrantsRequestSchema>

export async function projectListProjectGrantsRequestParse(
  options: ProjectListProjectGrantsRequestParseOptions = {},
): PromiseResult<ProjectListProjectGrantsRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectListProjectGrantsRequestParse",
    schema: ListProjectGrantsRequestSchema,
  })
}

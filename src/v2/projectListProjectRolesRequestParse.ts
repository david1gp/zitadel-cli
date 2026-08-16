import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListProjectRolesRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectListProjectRolesRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectListProjectRolesRequest = MessageInitShape<typeof ListProjectRolesRequestSchema>

export async function projectListProjectRolesRequestParse(
  options: ProjectListProjectRolesRequestParseOptions = {},
): PromiseResult<ProjectListProjectRolesRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectListProjectRolesRequestParse",
    schema: ListProjectRolesRequestSchema,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { CreateProjectGrantRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectCreateProjectGrantRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectCreateProjectGrantRequest = MessageInitShape<typeof CreateProjectGrantRequestSchema>

export async function projectCreateProjectGrantRequestParse(
  options: ProjectCreateProjectGrantRequestParseOptions = {},
): PromiseResult<ProjectCreateProjectGrantRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectCreateProjectGrantRequestParse",
    schema: CreateProjectGrantRequestSchema,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { UpdateProjectGrantRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectUpdateProjectGrantRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectUpdateProjectGrantRequest = MessageInitShape<typeof UpdateProjectGrantRequestSchema>

export async function projectUpdateProjectGrantRequestParse(
  options: ProjectUpdateProjectGrantRequestParseOptions = {},
): PromiseResult<ProjectUpdateProjectGrantRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectUpdateProjectGrantRequestParse",
    schema: UpdateProjectGrantRequestSchema,
  })
}

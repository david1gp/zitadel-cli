import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeleteProjectGrantRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectDeleteProjectGrantRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectDeleteProjectGrantRequest = MessageInitShape<typeof DeleteProjectGrantRequestSchema>

export async function projectDeleteProjectGrantRequestParse(
  options: ProjectDeleteProjectGrantRequestParseOptions = {},
): PromiseResult<ProjectDeleteProjectGrantRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectDeleteProjectGrantRequestParse",
    schema: DeleteProjectGrantRequestSchema,
  })
}

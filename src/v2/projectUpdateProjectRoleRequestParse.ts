import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { UpdateProjectRoleRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectUpdateProjectRoleRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectUpdateProjectRoleRequest = MessageInitShape<typeof UpdateProjectRoleRequestSchema>

export async function projectUpdateProjectRoleRequestParse(
  options: ProjectUpdateProjectRoleRequestParseOptions = {},
): PromiseResult<ProjectUpdateProjectRoleRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectUpdateProjectRoleRequestParse",
    schema: UpdateProjectRoleRequestSchema,
  })
}

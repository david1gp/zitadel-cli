import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveProjectRoleRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectRemoveProjectRoleRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectRemoveProjectRoleRequest = MessageInitShape<typeof RemoveProjectRoleRequestSchema>

export async function projectRemoveProjectRoleRequestParse(
  options: ProjectRemoveProjectRoleRequestParseOptions = {},
): PromiseResult<ProjectRemoveProjectRoleRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectRemoveProjectRoleRequestParse",
    schema: RemoveProjectRoleRequestSchema,
  })
}

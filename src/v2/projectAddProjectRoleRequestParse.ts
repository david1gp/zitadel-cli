import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddProjectRoleRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectAddProjectRoleRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectAddProjectRoleRequest = MessageInitShape<typeof AddProjectRoleRequestSchema>

export async function projectAddProjectRoleRequestParse(
  options: ProjectAddProjectRoleRequestParseOptions = {},
): PromiseResult<ProjectAddProjectRoleRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectAddProjectRoleRequestParse",
    schema: AddProjectRoleRequestSchema,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeactivateProjectGrantRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectDeactivateProjectGrantRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectDeactivateProjectGrantRequest = MessageInitShape<typeof DeactivateProjectGrantRequestSchema>

export async function projectDeactivateProjectGrantRequestParse(
  options: ProjectDeactivateProjectGrantRequestParseOptions = {},
): PromiseResult<ProjectDeactivateProjectGrantRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectDeactivateProjectGrantRequestParse",
    schema: DeactivateProjectGrantRequestSchema,
  })
}

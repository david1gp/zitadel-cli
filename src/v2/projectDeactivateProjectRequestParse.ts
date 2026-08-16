import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeactivateProjectRequestSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ProjectDeactivateProjectRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ProjectDeactivateProjectRequest = MessageInitShape<typeof DeactivateProjectRequestSchema>

export async function projectDeactivateProjectRequestParse(
  options: ProjectDeactivateProjectRequestParseOptions = {},
): PromiseResult<ProjectDeactivateProjectRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "projectDeactivateProjectRequestParse",
    schema: DeactivateProjectRequestSchema,
  })
}

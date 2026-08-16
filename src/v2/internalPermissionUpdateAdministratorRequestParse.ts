import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { UpdateAdministratorRequestSchema } from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type InternalPermissionUpdateAdministratorRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type InternalPermissionUpdateAdministratorRequest = MessageInitShape<typeof UpdateAdministratorRequestSchema>

export async function internalPermissionUpdateAdministratorRequestParse(
  options: InternalPermissionUpdateAdministratorRequestParseOptions = {},
): PromiseResult<InternalPermissionUpdateAdministratorRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "internalPermissionUpdateAdministratorRequestParse",
    schema: UpdateAdministratorRequestSchema,
  })
}

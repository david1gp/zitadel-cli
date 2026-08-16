import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { CreateAdministratorRequestSchema } from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type InternalPermissionCreateAdministratorRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type InternalPermissionCreateAdministratorRequest = MessageInitShape<typeof CreateAdministratorRequestSchema>

export async function internalPermissionCreateAdministratorRequestParse(
  options: InternalPermissionCreateAdministratorRequestParseOptions = {},
): PromiseResult<InternalPermissionCreateAdministratorRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "internalPermissionCreateAdministratorRequestParse",
    schema: CreateAdministratorRequestSchema,
  })
}

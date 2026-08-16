import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListAdministratorsRequestSchema } from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type InternalPermissionListAdministratorsRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type InternalPermissionListAdministratorsRequest = MessageInitShape<typeof ListAdministratorsRequestSchema>

export async function internalPermissionListAdministratorsRequestParse(
  options: InternalPermissionListAdministratorsRequestParseOptions = {},
): PromiseResult<InternalPermissionListAdministratorsRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "internalPermissionListAdministratorsRequestParse",
    schema: ListAdministratorsRequestSchema,
  })
}

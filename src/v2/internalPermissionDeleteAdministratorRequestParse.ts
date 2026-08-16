import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeleteAdministratorRequestSchema } from "../generated/zitadel/internal_permission/v2/internal_permission_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type InternalPermissionDeleteAdministratorRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type InternalPermissionDeleteAdministratorRequest = MessageInitShape<typeof DeleteAdministratorRequestSchema>

export async function internalPermissionDeleteAdministratorRequestParse(
  options: InternalPermissionDeleteAdministratorRequestParseOptions = {},
): PromiseResult<InternalPermissionDeleteAdministratorRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "internalPermissionDeleteAdministratorRequestParse",
    schema: DeleteAdministratorRequestSchema,
  })
}

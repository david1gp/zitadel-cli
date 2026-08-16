import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeleteOrganizationRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationDeleteOrganizationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationDeleteOrganizationRequest = MessageInitShape<typeof DeleteOrganizationRequestSchema>

export async function organizationDeleteOrganizationRequestParse(
  options: OrganizationDeleteOrganizationRequestParseOptions = {},
): PromiseResult<OrganizationDeleteOrganizationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationDeleteOrganizationRequestParse",
    schema: DeleteOrganizationRequestSchema,
  })
}

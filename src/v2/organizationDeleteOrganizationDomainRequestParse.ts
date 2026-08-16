import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeleteOrganizationDomainRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationDeleteOrganizationDomainRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationDeleteOrganizationDomainRequest = MessageInitShape<typeof DeleteOrganizationDomainRequestSchema>

export async function organizationDeleteOrganizationDomainRequestParse(
  options: OrganizationDeleteOrganizationDomainRequestParseOptions = {},
): PromiseResult<OrganizationDeleteOrganizationDomainRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationDeleteOrganizationDomainRequestParse",
    schema: DeleteOrganizationDomainRequestSchema,
  })
}

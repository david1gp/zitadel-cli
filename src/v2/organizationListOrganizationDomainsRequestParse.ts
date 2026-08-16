import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListOrganizationDomainsRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationListOrganizationDomainsRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationListOrganizationDomainsRequest = MessageInitShape<typeof ListOrganizationDomainsRequestSchema>

export async function organizationListOrganizationDomainsRequestParse(
  options: OrganizationListOrganizationDomainsRequestParseOptions = {},
): PromiseResult<OrganizationListOrganizationDomainsRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationListOrganizationDomainsRequestParse",
    schema: ListOrganizationDomainsRequestSchema,
  })
}

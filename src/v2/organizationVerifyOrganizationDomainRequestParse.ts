import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { VerifyOrganizationDomainRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationVerifyOrganizationDomainRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationVerifyOrganizationDomainRequest = MessageInitShape<typeof VerifyOrganizationDomainRequestSchema>

export async function organizationVerifyOrganizationDomainRequestParse(
  options: OrganizationVerifyOrganizationDomainRequestParseOptions = {},
): PromiseResult<OrganizationVerifyOrganizationDomainRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationVerifyOrganizationDomainRequestParse",
    schema: VerifyOrganizationDomainRequestSchema,
  })
}

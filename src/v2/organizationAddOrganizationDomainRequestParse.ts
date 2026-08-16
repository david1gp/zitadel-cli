import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddOrganizationDomainRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationAddOrganizationDomainRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationAddOrganizationDomainRequest = MessageInitShape<typeof AddOrganizationDomainRequestSchema>

export async function organizationAddOrganizationDomainRequestParse(
  options: OrganizationAddOrganizationDomainRequestParseOptions = {},
): PromiseResult<OrganizationAddOrganizationDomainRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationAddOrganizationDomainRequestParse",
    schema: AddOrganizationDomainRequestSchema,
  })
}

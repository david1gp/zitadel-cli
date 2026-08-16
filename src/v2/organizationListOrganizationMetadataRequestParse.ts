import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListOrganizationMetadataRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationListOrganizationMetadataRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationListOrganizationMetadataRequest = MessageInitShape<typeof ListOrganizationMetadataRequestSchema>

export async function organizationListOrganizationMetadataRequestParse(
  options: OrganizationListOrganizationMetadataRequestParseOptions = {},
): PromiseResult<OrganizationListOrganizationMetadataRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationListOrganizationMetadataRequestParse",
    schema: ListOrganizationMetadataRequestSchema,
  })
}

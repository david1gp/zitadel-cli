import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeleteOrganizationMetadataRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationDeleteOrganizationMetadataRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationDeleteOrganizationMetadataRequest = MessageInitShape<
  typeof DeleteOrganizationMetadataRequestSchema
>

export async function organizationDeleteOrganizationMetadataRequestParse(
  options: OrganizationDeleteOrganizationMetadataRequestParseOptions = {},
): PromiseResult<OrganizationDeleteOrganizationMetadataRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationDeleteOrganizationMetadataRequestParse",
    schema: DeleteOrganizationMetadataRequestSchema,
  })
}

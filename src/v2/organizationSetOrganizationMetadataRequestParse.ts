import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { SetOrganizationMetadataRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationSetOrganizationMetadataRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationSetOrganizationMetadataRequest = MessageInitShape<typeof SetOrganizationMetadataRequestSchema>

export async function organizationSetOrganizationMetadataRequestParse(
  options: OrganizationSetOrganizationMetadataRequestParseOptions = {},
): PromiseResult<OrganizationSetOrganizationMetadataRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationSetOrganizationMetadataRequestParse",
    schema: SetOrganizationMetadataRequestSchema,
  })
}

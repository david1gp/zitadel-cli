import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListOrganizationsRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationListOrganizationsRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationListOrganizationsRequest = MessageInitShape<typeof ListOrganizationsRequestSchema>

export async function organizationListOrganizationsRequestParse(
  options: OrganizationListOrganizationsRequestParseOptions = {},
): PromiseResult<OrganizationListOrganizationsRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationListOrganizationsRequestParse",
    schema: ListOrganizationsRequestSchema,
  })
}

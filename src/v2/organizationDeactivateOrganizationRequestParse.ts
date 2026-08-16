import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeactivateOrganizationRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationDeactivateOrganizationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationDeactivateOrganizationRequest = MessageInitShape<typeof DeactivateOrganizationRequestSchema>

export async function organizationDeactivateOrganizationRequestParse(
  options: OrganizationDeactivateOrganizationRequestParseOptions = {},
): PromiseResult<OrganizationDeactivateOrganizationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationDeactivateOrganizationRequestParse",
    schema: DeactivateOrganizationRequestSchema,
  })
}

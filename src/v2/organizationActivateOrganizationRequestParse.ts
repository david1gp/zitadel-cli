import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ActivateOrganizationRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationActivateOrganizationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationActivateOrganizationRequest = MessageInitShape<typeof ActivateOrganizationRequestSchema>

export async function organizationActivateOrganizationRequestParse(
  options: OrganizationActivateOrganizationRequestParseOptions = {},
): PromiseResult<OrganizationActivateOrganizationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationActivateOrganizationRequestParse",
    schema: ActivateOrganizationRequestSchema,
  })
}

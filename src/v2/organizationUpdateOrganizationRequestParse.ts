import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { UpdateOrganizationRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationUpdateOrganizationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationUpdateOrganizationRequest = MessageInitShape<typeof UpdateOrganizationRequestSchema>

export async function organizationUpdateOrganizationRequestParse(
  options: OrganizationUpdateOrganizationRequestParseOptions = {},
): PromiseResult<OrganizationUpdateOrganizationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationUpdateOrganizationRequestParse",
    schema: UpdateOrganizationRequestSchema,
  })
}

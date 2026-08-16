import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddOrganizationRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationAddOrganizationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationAddOrganizationRequest = MessageInitShape<typeof AddOrganizationRequestSchema>

export async function organizationAddOrganizationRequestParse(
  options: OrganizationAddOrganizationRequestParseOptions = {},
): PromiseResult<OrganizationAddOrganizationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationAddOrganizationRequestParse",
    schema: AddOrganizationRequestSchema,
  })
}

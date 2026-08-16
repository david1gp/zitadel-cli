import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { GenerateOrganizationDomainValidationRequestSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type OrganizationGenerateOrganizationDomainValidationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type OrganizationGenerateOrganizationDomainValidationRequest = MessageInitShape<
  typeof GenerateOrganizationDomainValidationRequestSchema
>

export async function organizationGenerateOrganizationDomainValidationRequestParse(
  options: OrganizationGenerateOrganizationDomainValidationRequestParseOptions = {},
): PromiseResult<OrganizationGenerateOrganizationDomainValidationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "organizationGenerateOrganizationDomainValidationRequestParse",
    schema: GenerateOrganizationDomainValidationRequestSchema,
  })
}

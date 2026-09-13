import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  GenerateOrganizationDomainValidationRequestSchema,
  type GenerateOrganizationDomainValidationResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceGenerateOrganizationDomainValidationRequest = MessageInitShape<
  typeof GenerateOrganizationDomainValidationRequestSchema
>

export type OrganizationServiceGenerateOrganizationDomainValidationOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceGenerateOrganizationDomainValidationRequest
}

/**
 * Generates a validation token for an organization's domain.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.GenerateOrganizationDomainValidation
 */
export async function organizationServiceGenerateOrganizationDomainValidation(
  options: OrganizationServiceGenerateOrganizationDomainValidationOptions = {},
): PromiseResult<GenerateOrganizationDomainValidationResponse> {
  const op = "organizationServiceGenerateOrganizationDomainValidation"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.generateOrganizationDomainValidation(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}

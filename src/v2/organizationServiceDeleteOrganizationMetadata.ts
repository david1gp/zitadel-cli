import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  DeleteOrganizationMetadataRequestSchema,
  type DeleteOrganizationMetadataResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceDeleteOrganizationMetadataRequest = MessageInitShape<
  typeof DeleteOrganizationMetadataRequestSchema
>

export type OrganizationServiceDeleteOrganizationMetadataOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceDeleteOrganizationMetadataRequest
}

/**
 * Deletes selected metadata entries from an organization.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.DeleteOrganizationMetadata
 */
export async function organizationServiceDeleteOrganizationMetadata(
  options: OrganizationServiceDeleteOrganizationMetadataOptions = {},
): PromiseResult<DeleteOrganizationMetadataResponse> {
  const op = "organizationServiceDeleteOrganizationMetadata"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deleteOrganizationMetadata(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}

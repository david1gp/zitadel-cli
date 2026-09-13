import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ListOrganizationMetadataRequestSchema,
  type ListOrganizationMetadataResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceListOrganizationMetadataRequest = MessageInitShape<
  typeof ListOrganizationMetadataRequestSchema
>

export type OrganizationServiceListOrganizationMetadataOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceListOrganizationMetadataRequest
}

/**
 * Lists metadata of an organization filtered by query.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.ListOrganizationMetadata
 */
export async function organizationServiceListOrganizationMetadata(
  options: OrganizationServiceListOrganizationMetadataOptions = {},
): PromiseResult<ListOrganizationMetadataResponse> {
  const op = "organizationServiceListOrganizationMetadata"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listOrganizationMetadata(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}

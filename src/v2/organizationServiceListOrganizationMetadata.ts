import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ListOrganizationMetadataRequestSchema,
  type ListOrganizationMetadataResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type OrganizationServiceListOrganizationMetadataRequest = MessageInitShape<
  typeof ListOrganizationMetadataRequestSchema
>

export type OrganizationServiceListOrganizationMetadataOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: OrganizationServiceListOrganizationMetadataRequest
  readonly token?: string
  readonly transport?: Transport
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
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listOrganizationMetadata(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}

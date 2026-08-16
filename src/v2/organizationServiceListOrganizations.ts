import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ListOrganizationsRequestSchema,
  type ListOrganizationsResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type OrganizationServiceListOrganizationsRequest = MessageInitShape<typeof ListOrganizationsRequestSchema>

export type OrganizationServiceListOrganizationsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: OrganizationServiceListOrganizationsRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists organizations visible to the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.ListOrganizations
 */
export async function organizationServiceListOrganizations(
  options: OrganizationServiceListOrganizationsOptions = {},
): PromiseResult<ListOrganizationsResponse> {
  const op = "organizationServiceListOrganizations"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listOrganizations(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}

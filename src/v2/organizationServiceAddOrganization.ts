import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  AddOrganizationRequestSchema,
  type AddOrganizationResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type OrganizationServiceAddOrganizationRequest = MessageInitShape<typeof AddOrganizationRequestSchema>

export type OrganizationServiceAddOrganizationOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: OrganizationServiceAddOrganizationRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Creates an organization for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.AddOrganization
 */
export async function organizationServiceAddOrganization(
  options: OrganizationServiceAddOrganizationOptions = {},
): PromiseResult<AddOrganizationResponse> {
  const op = "organizationServiceAddOrganization"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.addOrganization(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}

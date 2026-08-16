import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ActivateOrganizationRequestSchema,
  type ActivateOrganizationResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type OrganizationServiceActivateOrganizationRequest = MessageInitShape<typeof ActivateOrganizationRequestSchema>

export type OrganizationServiceActivateOrganizationOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: OrganizationServiceActivateOrganizationRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Activates an organization for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.ActivateOrganization
 */
export async function organizationServiceActivateOrganization(
  options: OrganizationServiceActivateOrganizationOptions = {},
): PromiseResult<ActivateOrganizationResponse> {
  const op = "organizationServiceActivateOrganization"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.activateOrganization(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}

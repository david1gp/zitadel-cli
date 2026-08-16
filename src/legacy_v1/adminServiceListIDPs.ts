import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport as ConnectTransport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  AdminService as GeneratedAdminService,
  ListIDPsRequestSchema,
  type ListIDPsResponse,
} from "../generated/zitadel/admin_pb.js"
import { endpointCall } from "../v2/internal/endpointCall.js"

const listIDPsAdminService = {
  ...GeneratedAdminService,
  methods: GeneratedAdminService.methods.filter(({ localName }) => localName === "listIDPs"),
} as const

export type AdminServiceListIDPsRequest = MessageInitShape<typeof ListIDPsRequestSchema>

export type AdminServiceListIDPsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: AdminServiceListIDPsRequest
  readonly token?: string
  readonly transport?: ConnectTransport
}

/**
 * Lists identity providers through the legacy v1 AdminService contract.
 *
 * This adapter is retained for compatibility with ZITADEL installations that still expose the v1 endpoint.
 * Prefer the current ZITADEL API when an equivalent v2 operation is available.
 *
 * @deprecated Legacy v1 compatibility adapter.
 * @see https://zitadel.com/docs/reference/api/admin/zitadel.admin.v1.AdminService.ListIDPs
 */
export async function adminServiceListIDPs(options: AdminServiceListIDPsOptions = {}): PromiseResult<ListIDPsResponse> {
  const op = "adminServiceListIDPs"

  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listIDPs(request),
    operation: op,
    request: options.request ?? {},
    service: listIDPsAdminService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport as ConnectTransport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  AddGoogleProviderRequestSchema,
  AdminService as GeneratedAdminService,
  type AddGoogleProviderResponse,
} from "../generated/zitadel/admin_pb.js"
import { endpointCall } from "../v2/internal/endpointCall.js"

const addGoogleProviderAdminService = {
  ...GeneratedAdminService,
  methods: GeneratedAdminService.methods.filter(({ localName }) => localName === "addGoogleProvider"),
} as const

export type AdminServiceAddGoogleProviderRequest = MessageInitShape<typeof AddGoogleProviderRequestSchema>

export type AdminServiceAddGoogleProviderOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: AdminServiceAddGoogleProviderRequest
  readonly token?: string
  readonly transport?: ConnectTransport
}

/**
 * Adds a Google identity provider through the legacy v1 AdminService contract.
 *
 * This adapter is retained for compatibility with ZITADEL installations that still expose the v1 endpoint. Prefer the
 * current ZITADEL API when an equivalent v2 operation is available.
 *
 * @deprecated Legacy v1 compatibility adapter.
 * @see https://zitadel.com/docs/reference/api/admin/zitadel.admin.v1.AdminService.AddGoogleProvider
 */
export async function adminServiceAddGoogleProvider(
  options: AdminServiceAddGoogleProviderOptions = {},
): PromiseResult<AddGoogleProviderResponse> {
  const op = "adminServiceAddGoogleProvider"

  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.addGoogleProvider(request),
    operation: op,
    request: options.request ?? {},
    service: addGoogleProviderAdminService,
    token: options.token,
    transport: options.transport,
  })
}

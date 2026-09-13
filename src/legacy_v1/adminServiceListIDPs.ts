import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  AdminService as GeneratedAdminService,
  ListIDPsRequestSchema,
  type ListIDPsResponse,
} from "../generated/zitadel/admin_pb.js"
import { endpointCall, type EndpointCallOptions } from "../v2/internal/endpointCall.js"

const listIDPsAdminService = {
  ...GeneratedAdminService,
  methods: GeneratedAdminService.methods.filter(({ localName }) => localName === "listIDPs"),
} as const

export type AdminServiceListIDPsRequest = MessageInitShape<typeof ListIDPsRequestSchema>

export type AdminServiceListIDPsOptions = EndpointCallOptions & {
  readonly request?: AdminServiceListIDPsRequest
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
    ...options,
    invoke: (client, request) => client.listIDPs(request),
    operation: op,
    request: options.request ?? {},
    service: listIDPsAdminService,
    token: options.token,
    transport: options.transport,
  })
}

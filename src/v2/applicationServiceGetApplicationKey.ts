import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ApplicationService,
  GetApplicationKeyRequestSchema,
  type GetApplicationKeyResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ApplicationServiceGetApplicationKeyRequest = MessageInitShape<typeof GetApplicationKeyRequestSchema>

export type ApplicationServiceGetApplicationKeyOptions = EndpointCallOptions & {
  readonly request?: ApplicationServiceGetApplicationKeyRequest
}

/**
 * Retrieves the application key matching the provided ID.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.GetApplicationKey
 */
export async function applicationServiceGetApplicationKey(
  options: ApplicationServiceGetApplicationKeyOptions = {},
): PromiseResult<GetApplicationKeyResponse> {
  const op = "applicationServiceGetApplicationKey"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.getApplicationKey(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

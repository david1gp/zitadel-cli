import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ApplicationService,
  DeleteApplicationKeyRequestSchema,
  type DeleteApplicationKeyResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ApplicationServiceDeleteApplicationKeyRequest = MessageInitShape<typeof DeleteApplicationKeyRequestSchema>

export type ApplicationServiceDeleteApplicationKeyOptions = EndpointCallOptions & {
  readonly request?: ApplicationServiceDeleteApplicationKeyRequest
}

/**
 * Deletes an application key matching the provided ID.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.DeleteApplicationKey
 */
export async function applicationServiceDeleteApplicationKey(
  options: ApplicationServiceDeleteApplicationKeyOptions = {},
): PromiseResult<DeleteApplicationKeyResponse> {
  const op = "applicationServiceDeleteApplicationKey"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deleteApplicationKey(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ApplicationService,
  CreateApplicationKeyRequestSchema,
  type CreateApplicationKeyResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ApplicationServiceCreateApplicationKeyRequest = MessageInitShape<typeof CreateApplicationKeyRequestSchema>

export type ApplicationServiceCreateApplicationKeyOptions = EndpointCallOptions & {
  readonly request?: ApplicationServiceCreateApplicationKeyRequest
}

/**
 * Creates an application key for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.CreateApplicationKey
 */
export async function applicationServiceCreateApplicationKey(
  options: ApplicationServiceCreateApplicationKeyOptions = {},
): PromiseResult<CreateApplicationKeyResponse> {
  const op = "applicationServiceCreateApplicationKey"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.createApplicationKey(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

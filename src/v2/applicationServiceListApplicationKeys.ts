import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ApplicationService,
  ListApplicationKeysRequestSchema,
  type ListApplicationKeysResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ApplicationServiceListApplicationKeysRequest = MessageInitShape<typeof ListApplicationKeysRequestSchema>

export type ApplicationServiceListApplicationKeysOptions = EndpointCallOptions & {
  readonly request?: ApplicationServiceListApplicationKeysRequest
}

/**
 * Lists application keys matching the request parameters.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.ListApplicationKeys
 */
export async function applicationServiceListApplicationKeys(
  options: ApplicationServiceListApplicationKeysOptions = {},
): PromiseResult<ListApplicationKeysResponse> {
  const op = "applicationServiceListApplicationKeys"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listApplicationKeys(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}

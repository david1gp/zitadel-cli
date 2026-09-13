import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActivateProjectGrantRequestSchema,
  type ActivateProjectGrantResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceActivateProjectGrantRequest = MessageInitShape<typeof ActivateProjectGrantRequestSchema>

export type ProjectServiceActivateProjectGrantOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceActivateProjectGrantRequest
}

/**
 * Activates a project grant for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ActivateProjectGrant
 */
export async function projectServiceActivateProjectGrant(
  options: ProjectServiceActivateProjectGrantOptions = {},
): PromiseResult<ActivateProjectGrantResponse> {
  const op = "projectServiceActivateProjectGrant"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.activateProjectGrant(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

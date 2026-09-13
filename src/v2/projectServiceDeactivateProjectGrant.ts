import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  DeactivateProjectGrantRequestSchema,
  type DeactivateProjectGrantResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceDeactivateProjectGrantRequest = MessageInitShape<typeof DeactivateProjectGrantRequestSchema>

export type ProjectServiceDeactivateProjectGrantOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceDeactivateProjectGrantRequest
}

/**
 * Sets the state of a project grant to deactivated.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.DeactivateProjectGrant
 */
export async function projectServiceDeactivateProjectGrant(
  options: ProjectServiceDeactivateProjectGrantOptions = {},
): PromiseResult<DeactivateProjectGrantResponse> {
  const op = "projectServiceDeactivateProjectGrant"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deactivateProjectGrant(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

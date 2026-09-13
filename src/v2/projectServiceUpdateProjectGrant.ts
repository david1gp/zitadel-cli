import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ProjectService,
  UpdateProjectGrantRequestSchema,
  type UpdateProjectGrantResponse,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceUpdateProjectGrantRequest = MessageInitShape<typeof UpdateProjectGrantRequestSchema>

export type ProjectServiceUpdateProjectGrantOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceUpdateProjectGrantRequest
}

/**
 * Updates the roles of a project grant.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.UpdateProjectGrant
 */
export async function projectServiceUpdateProjectGrant(
  options: ProjectServiceUpdateProjectGrantOptions = {},
): PromiseResult<UpdateProjectGrantResponse> {
  const op = "projectServiceUpdateProjectGrant"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.updateProjectGrant(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

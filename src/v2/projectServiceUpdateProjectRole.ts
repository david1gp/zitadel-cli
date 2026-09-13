import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ProjectService,
  UpdateProjectRoleRequestSchema,
  type UpdateProjectRoleResponse,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceUpdateProjectRoleRequest = MessageInitShape<typeof UpdateProjectRoleRequestSchema>

export type ProjectServiceUpdateProjectRoleOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceUpdateProjectRoleRequest
}

/**
 * Updates a project role for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.UpdateProjectRole
 */
export async function projectServiceUpdateProjectRole(
  options: ProjectServiceUpdateProjectRoleOptions = {},
): PromiseResult<UpdateProjectRoleResponse> {
  const op = "projectServiceUpdateProjectRole"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.updateProjectRole(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

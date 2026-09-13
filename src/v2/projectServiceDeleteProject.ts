import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  DeleteProjectRequestSchema,
  type DeleteProjectResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceDeleteProjectRequest = MessageInitShape<typeof DeleteProjectRequestSchema>

export type ProjectServiceDeleteProjectOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceDeleteProjectRequest
}

/**
 * Deletes an existing project for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.DeleteProject
 */
export async function projectServiceDeleteProject(
  options: ProjectServiceDeleteProjectOptions = {},
): PromiseResult<DeleteProjectResponse> {
  const op = "projectServiceDeleteProject"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deleteProject(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

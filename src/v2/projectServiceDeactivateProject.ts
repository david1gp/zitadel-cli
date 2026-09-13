import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  DeactivateProjectRequestSchema,
  type DeactivateProjectResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceDeactivateProjectRequest = MessageInitShape<typeof DeactivateProjectRequestSchema>

export type ProjectServiceDeactivateProjectOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceDeactivateProjectRequest
}

/**
 * Deactivates a project for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.DeactivateProject
 */
export async function projectServiceDeactivateProject(
  options: ProjectServiceDeactivateProjectOptions = {},
): PromiseResult<DeactivateProjectResponse> {
  const op = "projectServiceDeactivateProject"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deactivateProject(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

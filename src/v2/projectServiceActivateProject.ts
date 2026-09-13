import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActivateProjectRequestSchema,
  type ActivateProjectResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceActivateProjectRequest = MessageInitShape<typeof ActivateProjectRequestSchema>

export type ProjectServiceActivateProjectOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceActivateProjectRequest
}

/**
 * Activates a project for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ActivateProject
 */
export async function projectServiceActivateProject(
  options: ProjectServiceActivateProjectOptions = {},
): PromiseResult<ActivateProjectResponse> {
  const op = "projectServiceActivateProject"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.activateProject(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

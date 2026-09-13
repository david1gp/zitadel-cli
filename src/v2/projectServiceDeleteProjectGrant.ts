import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  DeleteProjectGrantRequestSchema,
  type DeleteProjectGrantResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceDeleteProjectGrantRequest = MessageInitShape<typeof DeleteProjectGrantRequestSchema>

export type ProjectServiceDeleteProjectGrantOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceDeleteProjectGrantRequest
}

/**
 * Deletes a project grant for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.DeleteProjectGrant
 */
export async function projectServiceDeleteProjectGrant(
  options: ProjectServiceDeleteProjectGrantOptions = {},
): PromiseResult<DeleteProjectGrantResponse> {
  const op = "projectServiceDeleteProjectGrant"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deleteProjectGrant(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}

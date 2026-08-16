import { ListProjectsResponseSchema } from "../generated/zitadel/project/v2/project_service_pb.js"
import { projectListProjectsRequestParse, projectServiceListProjects } from "../v2/index.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

export const projectsListCommand = endpointCommandBuild({
  call: projectServiceListProjects,
  docs: {
    brief: "List projects visible to the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListProjects protobuf JSON shape.",
  },
  operation: "projectsListCommandRun",
  requestName: "ListProjects",
  requestParse: projectListProjectsRequestParse,
  responseSchema: ListProjectsResponseSchema,
})

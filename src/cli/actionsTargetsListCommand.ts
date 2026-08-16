import { ListTargetsResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionListTargetsRequestParse } from "../v2/actionListTargetsRequestParse.js"
import { actionServiceListTargets } from "../v2/actionServiceListTargets.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.ListTargets.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListTargets
 */
export const actionsTargetsListCommand = endpointCommandBuild({
  call: actionServiceListTargets,
  docs: {
    brief: "List action targets visible to the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListTargets protobuf JSON shape.",
  },
  operation: "actionsTargetsListCommandRun",
  requestName: "ListTargets",
  requestParse: actionListTargetsRequestParse,
  responseSchema: ListTargetsResponseSchema,
})

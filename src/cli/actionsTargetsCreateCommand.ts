import { CreateTargetResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionCreateTargetRequestParse } from "../v2/actionCreateTargetRequestParse.js"
import { actionServiceCreateTarget } from "../v2/actionServiceCreateTarget.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.CreateTarget.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.CreateTarget
 */
export const actionsTargetsCreateCommand = endpointCommandBuild({
  call: actionServiceCreateTarget,
  docs: {
    brief: "Create an action target for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated CreateTarget protobuf JSON shape.",
  },
  operation: "actionsTargetsCreateCommandRun",
  requestName: "CreateTarget",
  requestParse: actionCreateTargetRequestParse,
  responseSchema: CreateTargetResponseSchema,
})

import { ListPublicKeysResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionListPublicKeysRequestParse } from "../v2/actionListPublicKeysRequestParse.js"
import { actionServiceListPublicKeys } from "../v2/actionServiceListPublicKeys.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.ListPublicKeys.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListPublicKeys
 */
export const actionsPublicKeysListCommand = endpointCommandBuild({
  call: actionServiceListPublicKeys,
  docs: {
    brief: "List public keys for an action target",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListPublicKeys protobuf JSON shape.",
  },
  operation: "actionsPublicKeysListCommandRun",
  requestName: "ListPublicKeys",
  requestParse: actionListPublicKeysRequestParse,
  responseSchema: ListPublicKeysResponseSchema,
})

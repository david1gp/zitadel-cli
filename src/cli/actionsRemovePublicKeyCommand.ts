import { RemovePublicKeyResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionRemovePublicKeyRequestParse } from "../v2/actionRemovePublicKeyRequestParse.js"
import { actionServiceRemovePublicKey } from "../v2/actionServiceRemovePublicKey.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.RemovePublicKey.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.RemovePublicKey
 */
export const actionsRemovePublicKeyCommand = endpointCommandBuild({
  call: actionServiceRemovePublicKey,
  docs: {
    brief: "Remove an inactive public key from an action target",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RemovePublicKey protobuf JSON shape.",
  },
  operation: "actionsRemovePublicKeyCommandRun",
  requestName: "RemovePublicKey",
  requestParse: actionRemovePublicKeyRequestParse,
  responseSchema: RemovePublicKeyResponseSchema,
})

import { ActivatePublicKeyResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionActivatePublicKeyRequestParse } from "../v2/actionActivatePublicKeyRequestParse.js"
import { actionServiceActivatePublicKey } from "../v2/actionServiceActivatePublicKey.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.ActivatePublicKey.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ActivatePublicKey
 */
export const actionsTargetsActivatePublicKeyCommand = endpointCommandBuild({
  call: actionServiceActivatePublicKey,
  docs: {
    brief: "Activate a public key for an action target",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ActivatePublicKey protobuf JSON shape.",
  },
  operation: "actionsTargetsActivatePublicKeyCommandRun",
  requestName: "ActivatePublicKey",
  requestParse: actionActivatePublicKeyRequestParse,
  responseSchema: ActivatePublicKeyResponseSchema,
})

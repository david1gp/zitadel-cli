import { AddPublicKeyResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionAddPublicKeyRequestParse } from "../v2/actionAddPublicKeyRequestParse.js"
import { actionServiceAddPublicKey } from "../v2/actionServiceAddPublicKey.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.AddPublicKey.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.AddPublicKey
 */
export const actionsTargetsAddPublicKeyCommand = endpointCommandBuild({
  call: actionServiceAddPublicKey,
  docs: {
    brief: "Add a public key to an action target",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated AddPublicKey protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.AddPublicKey",
  },
  operation: "actionsTargetsAddPublicKeyCommandRun",
  requestName: "AddPublicKey",
  requestParse: actionAddPublicKeyRequestParse,
  responseSchema: AddPublicKeyResponseSchema,
})

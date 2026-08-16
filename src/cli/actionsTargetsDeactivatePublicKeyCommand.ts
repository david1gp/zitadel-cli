import { DeactivatePublicKeyResponseSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { actionDeactivatePublicKeyRequestParse } from "../v2/actionDeactivatePublicKeyRequestParse.js"
import { actionServiceDeactivatePublicKey } from "../v2/actionServiceDeactivatePublicKey.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ActionService.DeactivatePublicKey.
 *
 * @see https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.DeactivatePublicKey
 */
export const actionsTargetsDeactivatePublicKeyCommand = endpointCommandBuild({
  call: actionServiceDeactivatePublicKey,
  docs: {
    brief: "Deactivate a public key for an action target",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeactivatePublicKey protobuf JSON shape.",
  },
  operation: "actionsTargetsDeactivatePublicKeyCommandRun",
  requestName: "DeactivatePublicKey",
  requestParse: actionDeactivatePublicKeyRequestParse,
  responseSchema: DeactivatePublicKeyResponseSchema,
})

import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListExecutionServicesRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionListExecutionServicesRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionListExecutionServicesRequest = MessageInitShape<typeof ListExecutionServicesRequestSchema>

export async function actionListExecutionServicesRequestParse(
  options: ActionListExecutionServicesRequestParseOptions = {},
): PromiseResult<ActionListExecutionServicesRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionListExecutionServicesRequestParse",
    schema: ListExecutionServicesRequestSchema,
  })
}

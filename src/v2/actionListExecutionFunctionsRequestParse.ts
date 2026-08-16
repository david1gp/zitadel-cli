import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListExecutionFunctionsRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionListExecutionFunctionsRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionListExecutionFunctionsRequest = MessageInitShape<typeof ListExecutionFunctionsRequestSchema>

export async function actionListExecutionFunctionsRequestParse(
  options: ActionListExecutionFunctionsRequestParseOptions = {},
): PromiseResult<ActionListExecutionFunctionsRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionListExecutionFunctionsRequestParse",
    schema: ListExecutionFunctionsRequestSchema,
  })
}

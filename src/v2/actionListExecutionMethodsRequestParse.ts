import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListExecutionMethodsRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionListExecutionMethodsRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionListExecutionMethodsRequest = MessageInitShape<typeof ListExecutionMethodsRequestSchema>

export async function actionListExecutionMethodsRequestParse(
  options: ActionListExecutionMethodsRequestParseOptions = {},
): PromiseResult<ActionListExecutionMethodsRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionListExecutionMethodsRequestParse",
    schema: ListExecutionMethodsRequestSchema,
  })
}

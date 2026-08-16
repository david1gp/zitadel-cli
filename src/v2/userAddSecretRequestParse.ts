import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddSecretRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserAddSecretRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserAddSecretRequest = MessageInitShape<typeof AddSecretRequestSchema>

export async function userAddSecretRequestParse(
  options: UserAddSecretRequestParseOptions = {},
): PromiseResult<UserAddSecretRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userAddSecretRequestParse",
    schema: AddSecretRequestSchema,
  })
}

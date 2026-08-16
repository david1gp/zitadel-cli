import type { DescMessage, MessageInitShape, MessageShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import { createResultError, type PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { endpointCall } from "../v2/internal/endpointCall.js"
import { endpointRequestParse } from "../v2/internal/endpointRequestParse.js"
import { apiMethodFind } from "./apiMethodFind.js"

export type ApiCallOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly method: string
  readonly requestFile?: string
  readonly requestJson?: string
  readonly request?: MessageInitShape<DescMessage>
  readonly token?: string
  readonly transport?: Transport
}

export async function apiCall(options: ApiCallOptions): PromiseResult<MessageShape<DescMessage>> {
  const op = "apiCall"
  const methodResult = apiMethodFind(options.method)
  if (!methodResult.success) {
    return createResultError(op, methodResult.errorMessage)
  }

  const catalogMethod = methodResult.data
  const methodDescriptor = catalogMethod.service.methods.find(({ localName }) => localName === catalogMethod.methodKey)
  if (methodDescriptor === undefined) {
    return createResultError(op, `Catalog method descriptor is missing for "${options.method}"`)
  }
  if (methodDescriptor.methodKind !== "unary") {
    return createResultError(op, `API method "${options.method}" is not a unary method supported by api call`)
  }

  if (options.request !== undefined && (options.requestJson !== undefined || options.requestFile !== undefined)) {
    return createResultError(op, "Use a request object or --request-json/--request-file, not both")
  }

  let request = options.request ?? {}
  if (options.requestJson !== undefined || options.requestFile !== undefined) {
    const requestResult = await endpointRequestParse({
      file: options.requestFile,
      json: options.requestJson,
      operation: `${op}RequestParse`,
      schema: catalogMethod.request,
    })
    if (!requestResult.success) {
      return createResultError(op, requestResult.errorMessage)
    }
    request = requestResult.data
  }

  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => {
      const invoke = (client as unknown as Record<string, unknown>)[catalogMethod.methodKey]
      if (typeof invoke !== "function") {
        return Promise.reject(new Error(`Catalog client method "${catalogMethod.methodKey}" is unavailable`))
      }
      return (invoke as (input: MessageInitShape<DescMessage>) => Promise<MessageShape<DescMessage>>)(request)
    },
    operation: op,
    request,
    service: catalogMethod.service,
    token: options.token,
    transport: options.transport,
  })
}

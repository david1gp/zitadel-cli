import type { DescMessage, MessageShape } from "@bufbuild/protobuf"
import { createResultError, type PromiseResult } from "#result"
import type { ApplicationContext, Command } from "@stricli/core"
import { buildCommand } from "@stricli/core"
import { messageSerialize, type MessageOutputFormat } from "../output/index.js"

type EndpointCommandFlags = {
  readonly baseUrl?: string
  readonly envFile?: string
  readonly output: MessageOutputFormat
  readonly requestFile?: string
  readonly requestJson?: string
  readonly token?: string
}

type EndpointRequestInput = {
  readonly file?: string
  readonly json?: string
}

type EndpointCommandCallOptions<Request> = {
  readonly baseUrl?: string
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request: Request
  readonly token?: string
}

type EndpointCommandDefinition<
  Request,
  ResponseSchema extends DescMessage,
  Response extends MessageShape<ResponseSchema>,
> = {
  readonly call: (options: EndpointCommandCallOptions<Request>) => PromiseResult<Response>
  readonly docs: {
    readonly brief: string
    readonly fullDescription: string
  }
  readonly operation: string
  readonly requestName: string
  readonly requestParse: (input: EndpointRequestInput) => PromiseResult<Request>
  readonly responseSchema: ResponseSchema
}

const endpointCommandFlags = {
  baseUrl: {
    brief: "ZITADEL base URL (overrides environment and env file)",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "URL",
  },
  envFile: {
    brief: "Explicit .env file path",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "PATH",
  },
  output: {
    brief: "Output format",
    default: "json",
    kind: "enum",
    values: ["json", "yaml"],
  },
  requestFile: {
    brief: "Read the protobuf JSON request from a file",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "PATH",
  },
  requestJson: {
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "JSON",
  },
  token: {
    brief: "Bearer token (overrides environment and env file)",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "TOKEN",
  },
} as const

export function endpointCommandBuild<
  Request,
  ResponseSchema extends DescMessage,
  Response extends MessageShape<ResponseSchema>,
>(definition: EndpointCommandDefinition<Request, ResponseSchema, Response>): Command<ApplicationContext> {
  const endpointCommandRun = async function (this: ApplicationContext, flags: EndpointCommandFlags) {
    const requestResult = await definition.requestParse({
      file: flags.requestFile,
      json: flags.requestJson,
    })
    if (!requestResult.success) {
      this.process.stderr.write(`${requestResult.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    const result = await definition.call({
      baseUrl: flags.baseUrl,
      env: this.process.env,
      envFile: flags.envFile,
      request: requestResult.data,
      token: flags.token,
    })
    if (!result.success) {
      this.process.stderr.write(`${result.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    const serialized = messageSerialize(definition.responseSchema, result.data, flags.output)
    if (!serialized.success) {
      const error = createResultError(definition.operation, serialized.errorMessage)
      this.process.stderr.write(`${error.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    this.process.stdout.write(`${serialized.data}\n`)
  }

  return buildCommand<EndpointCommandFlags, [], ApplicationContext>({
    func: endpointCommandRun,
    parameters: {
      flags: {
        ...endpointCommandFlags,
        requestJson: {
          ...endpointCommandFlags.requestJson,
          brief: `Provide the complete generated ${definition.requestName} protobuf JSON request`,
        },
      },
    },
    docs: definition.docs,
  })
}

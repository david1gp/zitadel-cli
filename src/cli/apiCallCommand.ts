import type { ApplicationContext, Command } from "@stricli/core"
import { buildCommand } from "@stricli/core"
import { apiCall, apiMethodFind } from "../api/index.js"
import { messageSerialize, type MessageOutputFormat } from "../output/index.js"

type ApiCallCommandFlags = {
  readonly baseUrl?: string
  readonly envFile?: string
  readonly output: MessageOutputFormat
  readonly requestFile?: string
  readonly requestJson?: string
  readonly token?: string
}

export const apiCallCommand: Command<ApplicationContext> = buildCommand<
  ApiCallCommandFlags,
  [string],
  ApplicationContext
>({
  func: async function (this: ApplicationContext, flags: ApiCallCommandFlags, target: string) {
    const methodResult = apiMethodFind(target)
    if (!methodResult.success) {
      this.process.stderr.write(`${methodResult.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    const result = await apiCall({
      baseUrl: flags.baseUrl,
      env: this.process.env,
      envFile: flags.envFile,
      method: target,
      requestFile: flags.requestFile,
      requestJson: flags.requestJson,
      token: flags.token,
    })
    if (!result.success) {
      this.process.stderr.write(`${result.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    const serialized = messageSerialize(methodResult.data.response, result.data, flags.output)
    if (!serialized.success) {
      this.process.stderr.write(`${serialized.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }
    this.process.stdout.write(`${serialized.data}\n`)
  },
  parameters: {
    flags: {
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
        brief: "Read the complete protobuf JSON request from a file",
        kind: "parsed",
        optional: true,
        parse: (input: string) => input,
        placeholder: "PATH",
      },
      requestJson: {
        brief: "Provide the complete generated protobuf JSON request",
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
    },
    positional: {
      kind: "tuple",
      parameters: [
        {
          brief: "Catalog-supported service and method target (for example ProjectService.ListProjects)",
          parse: (input: string) => input,
          placeholder: "METHOD",
        },
      ],
    },
  },
  docs: {
    brief: "Call one policy-supported unary API method",
    fullDescription:
      "Only methods in the policy-filtered catalog can be called. Requests use the complete generated protobuf JSON shape via --request-json or --request-file; configuration precedence is flag, process environment, then the selected .env file. JSON is the default response format.",
  },
})

import type { ApplicationContext, Command } from "@stricli/core"
import { buildCommand } from "@stricli/core"
import {
  apiMetadataSerialize,
  apiMethodDescribe,
  apiMethodFind,
  apiServiceDescribe,
  apiServiceFind,
  type ApiOutputFormat,
} from "../api/index.js"

type ApiDescribeCommandFlags = {
  readonly output: ApiOutputFormat
}

export const apiDescribeCommand: Command<ApplicationContext> = buildCommand<
  ApiDescribeCommandFlags,
  [string],
  ApplicationContext
>({
  func: function (this: ApplicationContext, flags: ApiDescribeCommandFlags, target: string) {
    const methodResult = apiMethodFind(target)
    if (methodResult.success) {
      const serialized = apiMetadataSerialize(apiMethodDescribe(methodResult.data), flags.output)
      if (!serialized.success) {
        this.process.stderr.write(`${serialized.errorMessage}\n`)
        this.process.exitCode = 1
        return
      }
      this.process.stdout.write(`${serialized.data}\n`)
      return
    }

    const serviceResult = apiServiceFind(target)
    if (!serviceResult.success) {
      this.process.stderr.write(`${methodResult.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    const serialized = apiMetadataSerialize(apiServiceDescribe(serviceResult.data), flags.output)
    if (!serialized.success) {
      this.process.stderr.write(`${serialized.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }
    this.process.stdout.write(`${serialized.data}\n`)
  },
  parameters: {
    flags: {
      output: {
        brief: "Output format",
        default: "json",
        kind: "enum",
        values: ["json", "yaml"],
      },
    },
    positional: {
      kind: "tuple",
      parameters: [
        {
          brief: "Service or method target (for example ProjectService.ListProjects)",
          parse: (input: string) => input,
          placeholder: "TARGET",
        },
      ],
    },
  },
  docs: {
    brief: "Describe a supported service or method",
    fullDescription:
      "Use a service name, fully qualified service name, Service.Method, or a fully qualified service/method target. Method descriptions include generated request and response field descriptors, official documentation, and policy metadata.",
  },
})

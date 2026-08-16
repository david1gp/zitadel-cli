import type { ApplicationContext, Command } from "@stricli/core"
import { buildCommand } from "@stricli/core"
import { apiCatalogList, apiMetadataSerialize, type ApiOutputFormat } from "../api/index.js"

type ApiListCommandFlags = {
  readonly apiVersion?: "legacy_v1" | "v2"
  readonly output: ApiOutputFormat
  readonly service?: string
}

export const apiListCommand: Command<ApplicationContext> = buildCommand<ApiListCommandFlags, [], ApplicationContext>({
  func: function (this: ApplicationContext, flags: ApiListCommandFlags) {
    const serialized = apiMetadataSerialize(
      apiCatalogList({
        apiVersion: flags.apiVersion,
        service: flags.service,
      }),
      flags.output,
    )
    if (!serialized.success) {
      this.process.stderr.write(`${serialized.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    this.process.stdout.write(`${serialized.data}\n`)
  },
  parameters: {
    flags: {
      apiVersion: {
        brief: "Filter by supported API version",
        kind: "enum",
        optional: true,
        values: ["v2", "legacy_v1"],
      },
      output: {
        brief: "Output format",
        default: "json",
        kind: "enum",
        values: ["json", "yaml"],
      },
      service: {
        brief: "Filter by service name, type name, or documentation category",
        kind: "parsed",
        optional: true,
        parse: (input: string) => input,
        placeholder: "SERVICE",
      },
    },
  },
  docs: {
    brief: "List the policy-supported ZITADEL API catalog",
    fullDescription:
      "Lists stable v2 services and the two approved legacy_v1 compatibility methods. Deprecated, beta, alpha, and other v1 methods are excluded. JSON is the default output; use --output yaml for YAML.",
  },
})

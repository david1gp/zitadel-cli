import type { ApplicationContext, Command } from "@stricli/core"
import { buildCommand } from "@stricli/core"
import { stringify } from "yaml"
import { createResult, createResultError, type Result } from "#result"
import { oidcDiscovery } from "../protocol/oidcDiscovery.js"
import type { OidcDiscoveryResponse } from "../protocol/oidcDiscoveryResponseSchema.js"

type OidcDiscoveryCommandFlags = {
  readonly baseUrl?: string
  readonly envFile?: string
  readonly output: "json" | "yaml"
}

const oidcDiscoverySerialize = (
  response: OidcDiscoveryResponse,
  format: OidcDiscoveryCommandFlags["output"],
): Result<string> => {
  const op = "oidcDiscoverySerialize"

  try {
    if (format === "json") {
      return createResult(JSON.stringify(response, null, 2))
    }
    return createResult(stringify(response))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError(op, message)
  }
}

/**
 * Standalone Stricli command for OIDC provider discovery.
 *
 * Add this command to an application's route map as `oidcDiscovery` when composing a CLI.
 */
export const oidcDiscoveryCommand: Command<ApplicationContext> = buildCommand<
  OidcDiscoveryCommandFlags,
  [],
  ApplicationContext
>({
  func: async function (this: ApplicationContext, flags: OidcDiscoveryCommandFlags) {
    const result = await oidcDiscovery({
      baseUrl: flags.baseUrl,
      env: this.process.env,
      envFile: flags.envFile,
    })
    if (!result.success) {
      this.process.stderr.write(`${result.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    const serialized = oidcDiscoverySerialize(result.data, flags.output)
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
        brief: "ZITADEL issuer base URL (overrides environment and env file)",
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
    },
  },
  docs: {
    brief: "Discover the OpenID Connect provider configuration",
    fullDescription:
      "Performs a public GET /.well-known/openid-configuration. Base URL precedence is flag, process environment, then the explicitly selected .env file.",
  },
})

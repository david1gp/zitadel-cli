import type { ApplicationContext, Command } from "@stricli/core"
import { buildCommand } from "@stricli/core"
import { createResult, createResultError, type Result } from "#result"
import { deviceAuthorizationRequest } from "./deviceAuthorizationRequest.js"
import { deviceAuthorizationSerialize } from "./deviceAuthorizationSerialize.js"

type DeviceAuthorizationCommandFlags = {
  readonly authorizationDetails?: string
  readonly clientAuthentication?: "none" | "client_secret_basic" | "client_secret_post"
  readonly clientId?: string
  readonly clientSecret?: string
  readonly deviceAuthorizationEndpoint?: string
  readonly envFile?: string
  readonly output: "json" | "yaml"
  readonly parametersJson?: string
  readonly resource?: string
  readonly scope?: string
}

const deviceAuthorizationCommandFlags = {
  authorizationDetails: {
    brief: "JSON authorization_details value",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "JSON",
  },
  clientAuthentication: {
    brief: "Client authentication method",
    kind: "enum",
    optional: true,
    values: ["none", "client_secret_basic", "client_secret_post"],
  },
  clientId: {
    brief: "OAuth client identifier",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "CLIENT_ID",
  },
  clientSecret: {
    brief: "OAuth client secret",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "SECRET",
  },
  deviceAuthorizationEndpoint: {
    brief: "device_authorization_endpoint from validated OIDC discovery",
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
  parametersJson: {
    brief: "Additional form parameters as a JSON object",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "JSON",
  },
  resource: {
    brief: "Space- or comma-separated OAuth resource indicators",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "URL[,URL]",
  },
  scope: {
    brief: "Space-delimited OAuth scope",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "SCOPE",
  },
} as const

const deviceAuthorizationParametersParse = (value: string): Result<Readonly<Record<string, string>>> => {
  const op = "deviceAuthorizationParametersParse"
  let parsed: unknown
  try {
    parsed = JSON.parse(value)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError(op, message)
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return createResultError(op, "parametersJson must be a JSON object")
  }

  const entries: [string, string][] = []
  for (const [key, entryValue] of Object.entries(parsed)) {
    if (typeof entryValue !== "string") {
      return createResultError(op, `parametersJson value for ${key} must be a string`)
    }
    entries.push([key, entryValue])
  }
  return createResult(Object.fromEntries(entries))
}

const deviceAuthorizationCommandRun = async function (
  this: ApplicationContext,
  flags: DeviceAuthorizationCommandFlags,
) {
  let parameters: Readonly<Record<string, string>> | undefined
  if (flags.parametersJson !== undefined) {
    const parametersResult = deviceAuthorizationParametersParse(flags.parametersJson)
    if (!parametersResult.success) {
      this.process.stderr.write(`${parametersResult.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }
    parameters = parametersResult.data
  }

  const result = await deviceAuthorizationRequest({
    authorizationDetails: flags.authorizationDetails,
    clientAuthentication: flags.clientAuthentication,
    clientId: flags.clientId,
    clientSecret: flags.clientSecret,
    deviceAuthorizationEndpoint: flags.deviceAuthorizationEndpoint,
    env: this.process.env,
    envFile: flags.envFile,
    parameters,
    resource: flags.resource?.split(/[\s,]+/).filter((item) => item.length > 0),
    scope: flags.scope,
  })
  if (!result.success) {
    this.process.stderr.write(`${result.errorMessage}\n`)
    this.process.exitCode = 1
    return
  }

  const serialized = deviceAuthorizationSerialize(result.data, flags.output)
  if (!serialized.success) {
    this.process.stderr.write(`${serialized.errorMessage}\n`)
    this.process.exitCode = 1
    return
  }
  this.process.stdout.write(`${serialized.data}\n`)
}

export const deviceAuthorizationCommand: Command<ApplicationContext> = buildCommand<
  DeviceAuthorizationCommandFlags,
  [],
  ApplicationContext
>({
  func: deviceAuthorizationCommandRun,
  parameters: { flags: deviceAuthorizationCommandFlags },
  docs: {
    brief: "Request an OAuth 2.0 device authorization",
    fullDescription:
      "Posts a complete form-encoded device authorization request to the device_authorization_endpoint returned by validated OIDC discovery. Configuration precedence is flag, process environment, then the explicitly selected .env file.",
  },
})

import { readFile } from "node:fs/promises"
import * as v from "valibot"
import { createResult, createResultError, type PromiseResult } from "#result"
import { type DeviceAuthorizationConfig, deviceAuthorizationConfigSchema } from "./deviceAuthorizationConfig.js"

type DeviceAuthorizationConfigCreateOptions = {
  readonly authorizationDetails?: string
  readonly clientAuthentication?: DeviceAuthorizationConfig["clientAuthentication"]
  readonly clientId?: string
  readonly clientSecret?: string
  readonly discovery?: unknown
  readonly deviceAuthorizationEndpoint?: string
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly parameters?: Readonly<Record<string, string>>
  readonly resource?: readonly string[]
  readonly scope?: string
}

const deviceAuthorizationDiscoverySchema = v.object({
  device_authorization_endpoint: v.pipe(v.string(), v.minLength(1), v.url()),
  issuer: v.pipe(v.string(), v.minLength(1), v.url()),
})

const deviceAuthorizationEnvFileParse = (text: string) => {
  const op = "deviceAuthorizationEnvFileParse"
  const values: Record<string, string> = {}

  for (const [index, sourceLine] of text.split(/\r?\n/).entries()) {
    const line = sourceLine.replace(/^\uFEFF/, "").trim()
    if (line === "" || line.startsWith("#")) {
      continue
    }

    const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line)
    if (!match) {
      return createResultError(op, `Invalid .env entry on line ${index + 1}`)
    }

    const key = match[1]
    const rawValueSource = match[2]
    if (key === undefined || rawValueSource === undefined) {
      return createResultError(op, `Invalid .env entry on line ${index + 1}`)
    }

    const rawValue = rawValueSource.trim()
    const quote = rawValue[0]
    if (quote === "'" || quote === '"') {
      if (rawValue.length < 2 || rawValue.at(-1) !== quote) {
        return createResultError(op, `Unclosed quote on line ${index + 1}`)
      }
      values[key] = rawValue.slice(1, -1)
      continue
    }

    values[key] = rawValue.replace(/\s+#.*$/, "").trim()
  }

  return createResult(values)
}

const environmentValue = (
  environment: Readonly<Record<string, string | undefined>>,
  fileValues: Readonly<Record<string, string>>,
  ...names: string[]
): string | undefined => {
  for (const name of names) {
    const value = environment[name]
    if (value !== undefined) {
      return value
    }
  }
  for (const name of names) {
    const value = fileValues[name]
    if (value !== undefined) {
      return value
    }
  }
  return undefined
}

const resourceParse = (value: string | undefined): string[] => {
  if (value === undefined || value.trim() === "") {
    return []
  }
  return value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

const parametersParse = (value: string | undefined) => {
  const op = "parametersParse"
  if (value === undefined || value.trim() === "") {
    return createResult({})
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(value)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError(op, message)
  }
  const result = v.safeParse(v.record(v.string(), v.string()), parsed)
  if (!result.success) {
    return createResultError(op, v.summarize(result.issues))
  }
  return createResult(result.output)
}

export async function deviceAuthorizationConfigCreate(
  options: DeviceAuthorizationConfigCreateOptions = {},
): PromiseResult<DeviceAuthorizationConfig> {
  const op = "deviceAuthorizationConfigCreate"
  let fileValues: Record<string, string> = {}

  if (options.envFile !== undefined) {
    let text: string
    try {
      text = await readFile(options.envFile, "utf8")
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return createResultError(op, `Unable to read env file "${options.envFile}": ${message}`)
    }

    const fileResult = deviceAuthorizationEnvFileParse(text)
    if (!fileResult.success) {
      return createResultError(op, fileResult.errorMessage)
    }
    fileValues = fileResult.data
  }

  const environment = options.env ?? process.env
  let discovery: v.InferOutput<typeof deviceAuthorizationDiscoverySchema> | undefined
  if (options.discovery !== undefined) {
    const discoveryResult = v.safeParse(deviceAuthorizationDiscoverySchema, options.discovery)
    if (!discoveryResult.success) {
      return createResultError(op, `Invalid OIDC discovery metadata: ${v.summarize(discoveryResult.issues)}`)
    }
    discovery = discoveryResult.output
  }

  let parameters: Readonly<Record<string, string>> = options.parameters ?? {}
  if (options.parameters === undefined) {
    const parametersResult = parametersParse(
      environmentValue(
        environment,
        fileValues,
        "ZITADEL_OIDC_PARAMETERS_JSON",
        "OIDC_PARAMETERS_JSON",
        "ZITADEL_PARAMETERS_JSON",
      ),
    )
    if (!parametersResult.success) {
      return createResultError(op, `Invalid device authorization parameters: ${parametersResult.errorMessage}`)
    }
    parameters = parametersResult.data
  }

  const clientSecret =
    options.clientSecret ??
    environmentValue(
      environment,
      fileValues,
      "ZITADEL_OIDC_CLIENT_SECRET",
      "OIDC_CLIENT_SECRET",
      "ZITADEL_CLIENT_SECRET",
    )
  const clientAuthentication =
    options.clientAuthentication ??
    environmentValue(
      environment,
      fileValues,
      "ZITADEL_OIDC_CLIENT_AUTHENTICATION",
      "OIDC_CLIENT_AUTHENTICATION",
      "ZITADEL_CLIENT_AUTHENTICATION",
    ) ??
    (clientSecret === undefined ? "none" : "client_secret_post")
  const input = {
    authorizationDetails:
      options.authorizationDetails ??
      environmentValue(
        environment,
        fileValues,
        "ZITADEL_OIDC_AUTHORIZATION_DETAILS",
        "OIDC_AUTHORIZATION_DETAILS",
        "ZITADEL_AUTHORIZATION_DETAILS",
      ),
    clientAuthentication,
    clientId:
      options.clientId ??
      environmentValue(environment, fileValues, "ZITADEL_OIDC_CLIENT_ID", "OIDC_CLIENT_ID", "ZITADEL_CLIENT_ID"),
    clientSecret,
    deviceAuthorizationEndpoint:
      options.deviceAuthorizationEndpoint ??
      discovery?.device_authorization_endpoint ??
      environmentValue(
        environment,
        fileValues,
        "ZITADEL_OIDC_DEVICE_AUTHORIZATION_ENDPOINT",
        "OIDC_DEVICE_AUTHORIZATION_ENDPOINT",
        "ZITADEL_DEVICE_AUTHORIZATION_ENDPOINT",
      ),
    issuer: discovery?.issuer,
    parameters,
    resource:
      options.resource ??
      resourceParse(
        environmentValue(environment, fileValues, "ZITADEL_OIDC_RESOURCE", "OIDC_RESOURCE", "ZITADEL_RESOURCE"),
      ),
    scope:
      options.scope ?? environmentValue(environment, fileValues, "ZITADEL_OIDC_SCOPE", "OIDC_SCOPE", "ZITADEL_SCOPE"),
  }
  const parsed = v.safeParse(deviceAuthorizationConfigSchema, input)
  if (!parsed.success) {
    return createResultError(op, v.summarize(parsed.issues))
  }

  if (parsed.output.clientAuthentication !== "none" && parsed.output.clientSecret === undefined) {
    return createResultError(op, `clientSecret is required for ${parsed.output.clientAuthentication}`)
  }

  return createResult(parsed.output)
}

export type { DeviceAuthorizationConfigCreateOptions }

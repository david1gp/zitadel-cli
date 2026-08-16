import { readFile } from "node:fs/promises"
import * as v from "valibot"
import { createResult, createResultError, type PromiseResult } from "#result"

const oauthTokenRequestConfigSchema = v.object({
  clientAuth: v.optional(v.picklist(["none", "client_secret_post", "client_secret_basic"])),
  clientId: v.optional(v.pipe(v.string(), v.minLength(1))),
  clientSecret: v.optional(v.pipe(v.string(), v.minLength(1))),
  grantType: v.optional(v.pipe(v.string(), v.minLength(1))),
  issuer: v.pipe(v.string(), v.minLength(1), v.url()),
})

export type OauthTokenRequestClientAuthentication = "none" | "client_secret_basic" | "client_secret_post"

export type OauthTokenRequestConfig = v.InferOutput<typeof oauthTokenRequestConfigSchema>

type OauthTokenRequestConfigCreateOptions = {
  readonly baseUrl?: string
  readonly clientAuth?: OauthTokenRequestClientAuthentication
  readonly clientId?: string
  readonly clientSecret?: string
  readonly config?: unknown
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly grantType?: string
  readonly issuer?: string
}

const oauthTokenRequestEnvFileParse = (text: string) => {
  const op = "oauthTokenRequestEnvFileParse"
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

export async function oauthTokenRequestConfigCreate(
  options: OauthTokenRequestConfigCreateOptions = {},
): PromiseResult<OauthTokenRequestConfig> {
  const op = "oauthTokenRequestConfigCreate"

  if (options.config !== undefined) {
    const parsed = v.safeParse(oauthTokenRequestConfigSchema, options.config)
    if (!parsed.success) {
      return createResultError(op, v.summarize(parsed.issues))
    }
    return createResult(parsed.output)
  }

  let fileValues: Record<string, string> = {}
  if (options.envFile !== undefined) {
    let text: string
    try {
      text = await readFile(options.envFile, "utf8")
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return createResultError(op, `Unable to read env file "${options.envFile}": ${message}`)
    }

    const fileResult = oauthTokenRequestEnvFileParse(text)
    if (!fileResult.success) {
      return createResultError(op, fileResult.errorMessage)
    }
    fileValues = fileResult.data
  }

  const environment = options.env ?? process.env
  const clientSecret =
    options.clientSecret ??
    environment.OIDC_CLIENT_SECRET ??
    environment.ZITADEL_OIDC_CLIENT_SECRET ??
    environment.ZITADEL_CLIENT_SECRET ??
    fileValues.OIDC_CLIENT_SECRET ??
    fileValues.ZITADEL_OIDC_CLIENT_SECRET ??
    fileValues.ZITADEL_CLIENT_SECRET
  const input = {
    clientAuth:
      options.clientAuth ??
      environment.OIDC_CLIENT_AUTH ??
      environment.OIDC_CLIENT_AUTHENTICATION ??
      environment.ZITADEL_OIDC_CLIENT_AUTH ??
      environment.ZITADEL_OIDC_CLIENT_AUTHENTICATION ??
      environment.ZITADEL_CLIENT_AUTHENTICATION ??
      fileValues.OIDC_CLIENT_AUTH ??
      fileValues.OIDC_CLIENT_AUTHENTICATION ??
      fileValues.ZITADEL_OIDC_CLIENT_AUTH ??
      fileValues.ZITADEL_OIDC_CLIENT_AUTHENTICATION ??
      fileValues.ZITADEL_CLIENT_AUTHENTICATION ??
      (clientSecret === undefined ? "none" : "client_secret_post"),
    clientId:
      options.clientId ??
      environment.OIDC_CLIENT_ID ??
      environment.ZITADEL_OIDC_CLIENT_ID ??
      environment.ZITADEL_CLIENT_ID ??
      fileValues.OIDC_CLIENT_ID ??
      fileValues.ZITADEL_OIDC_CLIENT_ID ??
      fileValues.ZITADEL_CLIENT_ID,
    clientSecret,
    grantType:
      options.grantType ??
      environment.OIDC_GRANT_TYPE ??
      environment.ZITADEL_OIDC_GRANT_TYPE ??
      fileValues.OIDC_GRANT_TYPE ??
      fileValues.ZITADEL_OIDC_GRANT_TYPE,
    issuer:
      options.issuer ??
      options.baseUrl ??
      environment.OIDC_ISSUER ??
      environment.ZITADEL_OIDC_ISSUER ??
      environment.ZITADEL_BASE_URL ??
      fileValues.OIDC_ISSUER ??
      fileValues.ZITADEL_OIDC_ISSUER ??
      fileValues.ZITADEL_BASE_URL,
  }
  const parsed = v.safeParse(oauthTokenRequestConfigSchema, input)
  if (!parsed.success) {
    return createResultError(op, v.summarize(parsed.issues))
  }

  return createResult(parsed.output)
}

import { createResult, createResultError } from "#result"
import { readFile } from "node:fs/promises"
import * as v from "valibot"
import { zitadelConfigSchema, type ZitadelConfig } from "./zitadelConfig.js"

type ZitadelConfigCreateOptions = {
  readonly baseUrl?: string
  readonly config?: unknown
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly token?: string
}

const envFileParse = (text: string) => {
  const op = "envFileParse"
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

export async function zitadelConfigCreate(options: ZitadelConfigCreateOptions = {}) {
  const op = "zitadelConfigCreate"

  if (options.config !== undefined) {
    const parsed = v.safeParse(zitadelConfigSchema, options.config)
    if (!parsed.success) {
      return createResultError(op, v.summarize(parsed.issues))
    }
    return createResult({
      ...parsed.output,
      baseUrl: parsed.output.baseUrl.replace(/\/+$/, "") || parsed.output.baseUrl,
    })
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

    const fileResult = envFileParse(text)
    if (!fileResult.success) {
      return createResultError(op, fileResult.errorMessage)
    }
    fileValues = fileResult.data
  }

  const environment = options.env ?? process.env
  const input = {
    baseUrl: options.baseUrl ?? environment.ZITADEL_BASE_URL ?? fileValues.ZITADEL_BASE_URL,
    token: options.token ?? environment.ZITADEL_TOKEN ?? fileValues.ZITADEL_TOKEN,
  }
  const parsed = v.safeParse(zitadelConfigSchema, input)
  if (!parsed.success) {
    return createResultError(op, v.summarize(parsed.issues))
  }

  const config: ZitadelConfig = {
    ...parsed.output,
    baseUrl: parsed.output.baseUrl.replace(/\/+$/, "") || parsed.output.baseUrl,
  }
  return createResult(config)
}

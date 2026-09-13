import { readFile, stat } from "node:fs/promises"
import * as v from "valibot"
import { createResult, createResultError, type PromiseResult } from "#result"

export type ConfigJsonFileReadOptions = {
  readonly allowMissing?: boolean
  readonly private?: boolean
}

export async function configJsonFileRead<T>(
  filePath: string,
  schema: v.GenericSchema<unknown, T>,
  options: ConfigJsonFileReadOptions = {},
): PromiseResult<T | undefined> {
  const op = "configJsonFileRead"

  let fileText: string
  try {
    if (options.private) {
      const fileStats = await stat(filePath)
      if ((fileStats.mode & 0o077) !== 0) {
        return createResultError(op, "Credential files must be private")
      }
    }
    fileText = await readFile(filePath, "utf8")
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : undefined
    if (code === "ENOENT" && options.allowMissing) {
      return createResult(undefined)
    }
    return createResultError(op, "Unable to read the central configuration file")
  }

  let value: unknown
  try {
    value = JSON.parse(fileText) as unknown
  } catch {
    return createResultError(op, "The central configuration file contains invalid JSON")
  }

  const parsed = v.safeParse(schema, value)
  if (!parsed.success) {
    return createResultError(op, `The central configuration file is invalid: ${v.summarize(parsed.issues)}`)
  }
  return createResult(parsed.output)
}

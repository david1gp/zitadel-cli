import { isAbsolute, relative, resolve } from "node:path"
import { createResult, createResultError, type Result } from "#result"
import { type ZitadelConfigPathOptions, zitadelConfigPaths } from "./zitadelConfigPaths.js"

export function zitadelConfigPath(options: ZitadelConfigPathOptions): Result<string> {
  const op = "zitadelConfigPath"
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(options.name) || options.name === "." || options.name === "..") {
    return createResultError(op, "Configuration names must be safe file names")
  }

  const paths = zitadelConfigPaths(options.env)
  const directory = options.kind === "credentials" ? paths.credentialsDirectory : paths.projectsDirectory
  const filePath = resolve(directory, `${options.name}.json`)
  const directoryPath = resolve(directory)
  const fileRelativePath = relative(directoryPath, filePath)
  if (fileRelativePath.startsWith("..") || isAbsolute(fileRelativePath)) {
    return createResultError(op, "Configuration names must stay inside the central configuration directory")
  }
  return createResult(filePath)
}

import { existsSync, realpathSync } from "node:fs"
import { release as osRelease } from "node:os"
import { dirname, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import pkg from "../../package.json" with { type: "json" }
import { PACKAGE_VERSION } from "../packageVersion.js"

type PackageMetadata = typeof pkg & {
  readonly author?: string | { readonly name?: string; readonly url?: string }
  readonly engines?: Readonly<Record<string, string>>
}

type Executable = {
  readonly entrypoint: string
  readonly target?: string
}

const packageMetadata = pkg as PackageMetadata

function zitadelCliExecutableResolve(): Executable {
  const entrypoint = process.argv[1]
  if (entrypoint === undefined) return { entrypoint: "unavailable" }

  const resolvedEntrypoint = resolve(entrypoint)
  try {
    return { entrypoint: resolvedEntrypoint, target: realpathSync(resolvedEntrypoint) }
  } catch {
    return { entrypoint: resolvedEntrypoint }
  }
}

function zitadelCliInstallationTypeResolve(executableTarget: string | undefined): string {
  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
  if (existsSync(resolve(packageRoot, ".git"))) return "development checkout"
  if (executableTarget !== undefined && !relative(packageRoot, executableTarget).startsWith(".."))
    return "package installation"
  return "unknown"
}

function zitadelCliAuthorRender(): string {
  if (typeof packageMetadata.author === "string") return packageMetadata.author
  if (packageMetadata.author !== undefined) {
    return [packageMetadata.author.name, packageMetadata.author.url].filter(Boolean).join(" — ") || "unavailable"
  }
  return "unavailable"
}

function zitadelCliRuntimeResolve(): string {
  if (typeof Bun !== "undefined") return `bun ${Bun.version}`
  return `${process.release.name} ${process.version}`
}

function zitadelCliRuntimeRequirementsRender(): string {
  return (
    Object.entries(packageMetadata.engines ?? {})
      .map(([runtime, requirement]) => `${runtime} ${requirement}`)
      .join(", ") || "unavailable"
  )
}

export function zitadelCliVersionMetadataRender(): string {
  const executable = zitadelCliExecutableResolve()
  const project = packageMetadata.homepage ?? packageMetadata.repository?.url ?? "unavailable"

  return [
    PACKAGE_VERSION,
    `user agent: ${packageMetadata.name}/${PACKAGE_VERSION}`,
    `executable: ${executable.entrypoint}`,
    `executable target: ${executable.target ?? "unavailable"}`,
    `version: ${PACKAGE_VERSION}`,
    `description: ${packageMetadata.description ?? "unavailable"}`,
    `author: ${zitadelCliAuthorRender()}`,
    `license: ${packageMetadata.license ?? "unavailable"}`,
    `project: ${project}`,
    `installation type: ${zitadelCliInstallationTypeResolve(executable.target)}`,
    `runtime: ${zitadelCliRuntimeResolve()}`,
    `runtime requirements: ${zitadelCliRuntimeRequirementsRender()}`,
    `platform: ${process.platform} ${process.arch} (OS release ${osRelease()})`,
  ].join("\n")
}

import { homedir } from "node:os"
import { join } from "node:path"

export type ZitadelConfigEnvironment = Readonly<Record<string, string | undefined>>

export type ZitadelConfigPaths = {
  readonly configDirectory: string
  readonly configFile: string
  readonly credentialsDirectory: string
  readonly projectsDirectory: string
}

export type ZitadelConfigPathOptions = {
  readonly env?: ZitadelConfigEnvironment
  readonly kind: "credentials" | "project"
  readonly name: string
}

const configDirectoryName = "zitadel-cli"

export function zitadelConfigPaths(environment?: ZitadelConfigEnvironment): ZitadelConfigPaths {
  const env = environment ?? process.env
  const configHome = env.XDG_CONFIG_HOME || join(env.HOME || homedir(), ".config")
  const configDirectory = join(configHome, configDirectoryName)
  return {
    configDirectory,
    configFile: join(configDirectory, "config.json"),
    credentialsDirectory: join(configDirectory, "credentials"),
    projectsDirectory: join(configDirectory, "projects"),
  }
}

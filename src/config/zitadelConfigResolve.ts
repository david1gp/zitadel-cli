import { readFile } from "node:fs/promises"
import * as v from "valibot"
import { createResult, createResultError, type PromiseResult } from "#result"
import { centralConfigRead } from "./centralConfigRead.js"
import { configJsonFileRead } from "./configJsonFileRead.js"
import { credentialsConfigSchema } from "./credentialsConfig.js"
import { envFileParse } from "./envFileParse.js"
import { type ProjectConfig } from "./projectConfig.js"
import { projectConfigRead } from "./projectConfigRead.js"
import { zitadelConfigSchema } from "./zitadelConfig.js"
import { zitadelConfigPath } from "./zitadelConfigPath.js"
import { type ZitadelConfigEnvironment } from "./zitadelConfigPaths.js"
import { type ZitadelConfigResolution, zitadelConfigResolutionSchema } from "./zitadelConfigResolution.js"

export type ZitadelConfigResolveOptions = {
  readonly baseUrl?: string
  readonly config?: unknown
  readonly env?: ZitadelConfigEnvironment
  readonly envFile?: string
  readonly organizationId?: string
  readonly profile?: string
  readonly project?: string
  readonly projectId?: string
  readonly token?: string
}

const valueSet = (input: Record<string, string>, key: string, value: string | undefined) => {
  if (value !== undefined) input[key] = value
}

export async function zitadelConfigResolve(
  options: ZitadelConfigResolveOptions = {},
): PromiseResult<ZitadelConfigResolution> {
  const op = "zitadelConfigResolve"

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
    } catch {
      return createResultError(op, "Unable to read the explicitly supplied env file")
    }

    const fileResult = envFileParse(text)
    if (!fileResult.success) {
      return createResultError(op, fileResult.errorMessage)
    }
    fileValues = fileResult.data
  }

  const environment = options.env ?? process.env
  const centralResult = await centralConfigRead({ env: environment })
  if (!centralResult.success) return createResultError(op, centralResult.errorMessage)

  const projectName = options.project ?? environment.ZITADEL_PROJECT ?? fileValues.ZITADEL_PROJECT
  let projectConfig: ProjectConfig | undefined
  if (projectName !== undefined) {
    const projectResult = await projectConfigRead({ env: environment, project: projectName })
    if (!projectResult.success) return createResultError(op, projectResult.errorMessage)
    projectConfig = projectResult.data
  }

  const profileName =
    options.profile ??
    environment.ZITADEL_PROFILE ??
    fileValues.ZITADEL_PROFILE ??
    projectConfig?.profile ??
    centralResult.data?.defaultProfile

  let profileConfig: { readonly baseUrl: string; readonly organizationId: string } | undefined
  if (profileName !== undefined) {
    const pathResult = zitadelConfigPath({ env: environment, kind: "credentials", name: profileName })
    if (!pathResult.success) return createResultError(op, pathResult.errorMessage)
    profileConfig = centralResult.data?.profiles[profileName]
  }

  const input: Record<string, string> = {}
  valueSet(
    input,
    "baseUrl",
    options.baseUrl ?? environment.ZITADEL_BASE_URL ?? fileValues.ZITADEL_BASE_URL ?? profileConfig?.baseUrl,
  )
  valueSet(
    input,
    "organizationId",
    options.organizationId ??
      environment.ZITADEL_ORGANIZATION_ID ??
      fileValues.ZITADEL_ORGANIZATION_ID ??
      profileConfig?.organizationId,
  )
  valueSet(input, "profile", profileName)
  valueSet(input, "project", projectName)
  valueSet(
    input,
    "projectId",
    options.projectId ?? environment.ZITADEL_PROJECT_ID ?? fileValues.ZITADEL_PROJECT_ID ?? projectConfig?.projectId,
  )

  const explicitToken = options.token ?? environment.ZITADEL_TOKEN ?? fileValues.ZITADEL_TOKEN
  if (explicitToken !== undefined) {
    valueSet(input, "token", explicitToken)
  } else if (profileName !== undefined) {
    const pathResult = zitadelConfigPath({ env: environment, kind: "credentials", name: profileName })
    if (!pathResult.success) return createResultError(op, pathResult.errorMessage)
    const credentialsResult = await configJsonFileRead(pathResult.data, credentialsConfigSchema, {
      allowMissing: true,
      private: true,
    })
    if (!credentialsResult.success) return createResultError(op, credentialsResult.errorMessage)
    valueSet(input, "token", credentialsResult.data?.token)
  }

  const parsed = v.safeParse(zitadelConfigResolutionSchema, input)
  if (!parsed.success) {
    return createResultError(op, v.summarize(parsed.issues))
  }
  const resolution: ZitadelConfigResolution = {
    ...parsed.output,
    ...(parsed.output.baseUrl === undefined
      ? {}
      : { baseUrl: parsed.output.baseUrl.replace(/\/+$/, "") || parsed.output.baseUrl }),
  }
  return createResult(resolution)
}

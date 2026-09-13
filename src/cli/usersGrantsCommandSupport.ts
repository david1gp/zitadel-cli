import { readFile } from "node:fs/promises"
import { createResult, createResultError, type PromiseResult, type Result } from "#result"
import { stringify } from "yaml"
import { testUserIdResolve } from "../config/testUserIdResolve.js"
import { zitadelConfigCreate, type ZitadelConfigCreateOptions } from "../config/zitadelConfigCreate.js"
import type { ZitadelConfigEnvironment } from "../config/zitadelConfigPaths.js"

type UserGrantsCommandConfigOptions = Omit<ZitadelConfigCreateOptions, "config"> & {
  readonly env?: ZitadelConfigEnvironment
}

type UserGrantsCommandUserOptions = {
  readonly env?: ZitadelConfigEnvironment
  readonly envFile?: string
  readonly profile?: string
  readonly project?: string
  readonly user?: string
  readonly userId?: string
}

type UserGrantsCommandRequestOptions = {
  readonly file?: string
  readonly json?: string
}

type UserGrantsCommandRoleOptions = {
  readonly roleKey?: readonly string[]
  readonly roleKeys?: readonly string[]
}

const usersGrantsCommandCommonFlags = {
  baseUrl: {
    brief: "ZITADEL base URL (overrides environment and env file)",
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
  organizationId: {
    brief: "Organization ID (overrides environment and env file)",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "ID",
  },
  output: {
    brief: "Output format",
    default: "json",
    kind: "enum",
    values: ["json", "yaml"],
  },
  profile: {
    brief: "Configuration profile (overrides environment, env file, and project)",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "NAME",
  },
  project: {
    brief: "Named project configuration",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "NAME",
  },
  projectId: {
    brief: "Project ID (overrides environment and env file)",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "ID",
  },
  token: {
    brief: "Bearer token (overrides environment and env file)",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "TOKEN",
  },
} as const

const usersGrantsCommandRawRequestFlags = {
  requestFile: {
    brief: "Read the complete Management v1 JSON request from a file",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "PATH",
  },
  requestJson: {
    brief: "Provide the complete Management v1 JSON request",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "JSON",
  },
} as const

const usersGrantsCommandUserFlags = {
  user: {
    brief: "Named test-user alias from the selected credentials",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "TEST-USER",
  },
  userId: {
    brief: "Explicit ZITADEL user ID",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "ID",
  },
} as const

const usersGrantsCommandRoleFlags = {
  roleKey: {
    brief: "Project role key; repeat the flag or provide comma-separated values",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "ROLE",
    variadic: ",",
  },
  roleKeys: {
    brief: "Project role keys; repeat the flag or provide comma-separated values",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "ROLE",
    variadic: ",",
  },
} as const

const usersGrantsCommandGrantFlags = {
  grantId: {
    brief: "User-grant ID",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "ID",
  },
} as const

const usersGrantsCommandListFlags = {
  limit: {
    brief: "Maximum number of grants to return",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "NUMBER",
  },
  offset: {
    brief: "Number of grants to skip",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "NUMBER",
  },
} as const

const usersGrantsCommandRequestParse = async (
  options: UserGrantsCommandRequestOptions,
): PromiseResult<Record<string, unknown> | undefined> => {
  const op = "usersGrantsCommandRequestParse"
  if (options.file !== undefined && options.json !== undefined) {
    return createResultError(op, "Specify only one of --request-json or --request-file")
  }
  if (options.file === undefined && options.json === undefined) return createResult(undefined)

  let text = options.json
  if (options.file !== undefined) {
    try {
      text = await readFile(options.file, "utf8")
    } catch {
      return createResultError(op, "Unable to read the requested Management v1 JSON request file")
    }
  }

  let value: unknown
  try {
    value = JSON.parse(text ?? "") as unknown
  } catch {
    return createResultError(op, "The Management v1 request is not valid JSON")
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return createResultError(op, "The Management v1 request must be a JSON object")
  }
  return createResult(value as Record<string, unknown>)
}

const usersGrantsCommandUserIdResolve = async (options: UserGrantsCommandUserOptions): PromiseResult<string> => {
  const user = options.user?.trim()
  const userId = options.userId?.trim()
  if (user !== undefined && userId !== undefined) {
    return createResultError("usersGrantsCommandUserIdResolve", "Specify only one of --user or --user-id")
  }
  if (userId !== undefined) {
    if (userId === "") return createResultError("usersGrantsCommandUserIdResolve", "--user-id must not be empty")
    return createResult(userId)
  }
  if (user === undefined || user === "") {
    return createResultError("usersGrantsCommandUserIdResolve", "Specify --user TEST-USER or --user-id ID")
  }
  return testUserIdResolve({
    env: options.env,
    envFile: options.envFile,
    profile: options.profile,
    project: options.project,
    user,
  })
}

const usersGrantsCommandRoleKeysParse = (options: UserGrantsCommandRoleOptions): Result<readonly string[]> => {
  const values = [...(options.roleKeys ?? []), ...(options.roleKey ?? [])]
  if (values.length === 0) return createResultError("usersGrantsCommandRoleKeysParse", "Specify at least one role key")
  const roleKeys = values.map((value) => value.trim())
  if (roleKeys.some((value) => value === "")) {
    return createResultError("usersGrantsCommandRoleKeysParse", "Role keys must not be empty")
  }
  if (new Set(roleKeys).size !== roleKeys.length) {
    return createResultError("usersGrantsCommandRoleKeysParse", "Role keys must be unique")
  }
  return createResult(roleKeys)
}

const usersGrantsCommandNumberParse = (value: string | undefined, name: string, fallback: number): Result<number> => {
  if (value === undefined) return createResult(fallback)
  if (!/^[0-9]+$/u.test(value)) {
    return createResultError("usersGrantsCommandNumberParse", `--${name} must be a non-negative integer`)
  }
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed)) {
    return createResultError("usersGrantsCommandNumberParse", `--${name} is too large`)
  }
  return createResult(parsed)
}

const usersGrantsCommandSerialize = (value: unknown, format: "json" | "yaml"): Result<string> => {
  const normalized = value === undefined ? {} : value
  try {
    if (format === "yaml") return createResult(stringify(normalized).trimEnd())
    return createResult(
      JSON.stringify(normalized, (_key, item: unknown) => (typeof item === "bigint" ? item.toString() : item), 2) ??
        "null",
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError("usersGrantsCommandSerialize", message)
  }
}

export const usersGrantsCommandSupport = {
  commonFlags: usersGrantsCommandCommonFlags,
  configCreate: (options: UserGrantsCommandConfigOptions) => zitadelConfigCreate(options),
  grantFlags: usersGrantsCommandGrantFlags,
  listFlags: usersGrantsCommandListFlags,
  numberParse: usersGrantsCommandNumberParse,
  rawRequestFlags: usersGrantsCommandRawRequestFlags,
  requestParse: usersGrantsCommandRequestParse,
  roleFlags: usersGrantsCommandRoleFlags,
  roleKeysParse: usersGrantsCommandRoleKeysParse,
  serialize: usersGrantsCommandSerialize,
  userFlags: usersGrantsCommandUserFlags,
  userIdResolve: usersGrantsCommandUserIdResolve,
}

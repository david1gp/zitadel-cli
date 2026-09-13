import type { ApplicationContext, Command } from "@stricli/core"
import { buildCommand } from "@stricli/core"
import {
  userGrantServiceAddUserGrant,
  type UserGrantServiceAddUserGrantRequest,
} from "../legacy_v1/userGrantServiceAddUserGrant.js"
import { usersGrantsCommandSupport } from "./usersGrantsCommandSupport.js"

type UsersGrantsAddCommandFlags = {
  readonly baseUrl?: string
  readonly envFile?: string
  readonly organizationId?: string
  readonly output: "json" | "yaml"
  readonly profile?: string
  readonly project?: string
  readonly projectId?: string
  readonly requestFile?: string
  readonly requestJson?: string
  readonly roleKey?: readonly string[]
  readonly roleKeys?: readonly string[]
  readonly token?: string
  readonly user?: string
  readonly userId?: string
}

export const usersGrantsAddCommand: Command<ApplicationContext> = buildCommand<
  UsersGrantsAddCommandFlags,
  [],
  ApplicationContext
>({
  func: async function (this: ApplicationContext, flags: UsersGrantsAddCommandFlags) {
    const requestResult = await usersGrantsCommandSupport.requestParse({
      file: flags.requestFile,
      json: flags.requestJson,
    })
    if (!requestResult.success) {
      this.process.stderr.write(`${requestResult.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }
    if (requestResult.data !== undefined && (flags.roleKey !== undefined || flags.roleKeys !== undefined)) {
      this.process.stderr.write("Do not combine --request-json/--request-file with role-key flags\n")
      this.process.exitCode = 1
      return
    }

    const userIdResult = await usersGrantsCommandSupport.userIdResolve({
      env: this.process.env,
      envFile: flags.envFile,
      profile: flags.profile,
      project: flags.project,
      user: flags.user,
      userId: flags.userId,
    })
    if (!userIdResult.success) {
      this.process.stderr.write(`${userIdResult.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    const configResult = await usersGrantsCommandSupport.configCreate({
      baseUrl: flags.baseUrl,
      env: this.process.env,
      envFile: flags.envFile,
      organizationId: flags.organizationId,
      profile: flags.profile,
      project: flags.project,
      projectId: flags.projectId,
      token: flags.token,
    })
    if (!configResult.success) {
      this.process.stderr.write(`${configResult.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    let request: UserGrantServiceAddUserGrantRequest
    if (requestResult.data !== undefined) {
      request = requestResult.data as UserGrantServiceAddUserGrantRequest
    } else {
      if (configResult.data.projectId === undefined) {
        this.process.stderr.write("Specify --project-id or select a project with a project ID\n")
        this.process.exitCode = 1
        return
      }
      const roleKeysResult = usersGrantsCommandSupport.roleKeysParse({
        roleKey: flags.roleKey,
        roleKeys: flags.roleKeys,
      })
      if (!roleKeysResult.success) {
        this.process.stderr.write(`${roleKeysResult.errorMessage}\n`)
        this.process.exitCode = 1
        return
      }
      request = { projectId: configResult.data.projectId, roleKeys: roleKeysResult.data }
    }

    const result = await userGrantServiceAddUserGrant({
      config: configResult.data,
      request,
      userId: userIdResult.data,
    })
    if (!result.success) {
      this.process.stderr.write(`${result.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }
    const serialized = usersGrantsCommandSupport.serialize(result.data, flags.output)
    if (!serialized.success) {
      this.process.stderr.write(`${serialized.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }
    this.process.stdout.write(`${serialized.data}\n`)
  },
  parameters: {
    flags: {
      ...usersGrantsCommandSupport.commonFlags,
      ...usersGrantsCommandSupport.rawRequestFlags,
      ...usersGrantsCommandSupport.roleFlags,
      ...usersGrantsCommandSupport.userFlags,
    },
  },
  docs: {
    brief: "Add a project-role assignment to a user",
    fullDescription:
      "Use --user TEST-USER for a central test-user alias or --user-id ID for an explicit user. The structured form requires --project-id (or a selected project) and one or more role keys. --request-json and --request-file send a raw Management v1 request body.",
  },
})

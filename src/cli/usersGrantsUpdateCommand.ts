import type { ApplicationContext, Command } from "@stricli/core"
import { buildCommand } from "@stricli/core"
import {
  userGrantServiceUpdateUserGrant,
  type UserGrantServiceUpdateUserGrantRequest,
} from "../legacy_v1/userGrantServiceUpdateUserGrant.js"
import { usersGrantsCommandSupport } from "./usersGrantsCommandSupport.js"

type UsersGrantsUpdateCommandFlags = {
  readonly baseUrl?: string
  readonly envFile?: string
  readonly grantId?: string
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

export const usersGrantsUpdateCommand: Command<ApplicationContext> = buildCommand<
  UsersGrantsUpdateCommandFlags,
  [],
  ApplicationContext
>({
  func: async function (this: ApplicationContext, flags: UsersGrantsUpdateCommandFlags) {
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
    if (flags.grantId === undefined || flags.grantId.trim() === "") {
      this.process.stderr.write("Specify --grant-id ID\n")
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

    let request: UserGrantServiceUpdateUserGrantRequest
    if (requestResult.data !== undefined) {
      request = requestResult.data as UserGrantServiceUpdateUserGrantRequest
    } else {
      const roleKeysResult = usersGrantsCommandSupport.roleKeysParse({
        roleKey: flags.roleKey,
        roleKeys: flags.roleKeys,
      })
      if (!roleKeysResult.success) {
        this.process.stderr.write(`${roleKeysResult.errorMessage}\n`)
        this.process.exitCode = 1
        return
      }
      request = { roleKeys: roleKeysResult.data }
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

    const result = await userGrantServiceUpdateUserGrant({
      config: configResult.data,
      grantId: flags.grantId.trim(),
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
      ...usersGrantsCommandSupport.grantFlags,
      ...usersGrantsCommandSupport.rawRequestFlags,
      ...usersGrantsCommandSupport.roleFlags,
      ...usersGrantsCommandSupport.userFlags,
    },
  },
  docs: {
    brief: "Replace a user's complete project-role assignment",
    fullDescription:
      "Update replaces the complete role-key set; it does not add one role. Use --user TEST-USER or --user-id ID together with --grant-id ID. --request-json and --request-file preserve a raw Management v1 request body.",
  },
})

import type { ApplicationContext, Command } from "@stricli/core"
import { buildCommand } from "@stricli/core"
import { userGrantServiceDeleteUserGrant } from "../legacy_v1/userGrantServiceDeleteUserGrant.js"
import { usersGrantsCommandSupport } from "./usersGrantsCommandSupport.js"

type UsersGrantsRemoveCommandFlags = {
  readonly baseUrl?: string
  readonly envFile?: string
  readonly grantId?: string
  readonly organizationId?: string
  readonly output: "json" | "yaml"
  readonly profile?: string
  readonly project?: string
  readonly projectId?: string
  readonly token?: string
  readonly user?: string
  readonly userId?: string
}

export const usersGrantsRemoveCommand: Command<ApplicationContext> = buildCommand<
  UsersGrantsRemoveCommandFlags,
  [],
  ApplicationContext
>({
  func: async function (this: ApplicationContext, flags: UsersGrantsRemoveCommandFlags) {
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

    const result = await userGrantServiceDeleteUserGrant({
      config: configResult.data,
      grantId: flags.grantId.trim(),
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
      ...usersGrantsCommandSupport.userFlags,
    },
  },
  docs: {
    brief: "Remove a user's complete project-role assignment",
    fullDescription:
      "Remove deletes the complete user-grant assignment. It requires --grant-id ID and --user TEST-USER or --user-id ID; removing one role instead requires update with the remaining role keys.",
  },
})

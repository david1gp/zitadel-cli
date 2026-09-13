import type { ApplicationContext, Command } from "@stricli/core"
import { buildCommand } from "@stricli/core"
import {
  userGrantServiceListUserGrants,
  type UserGrantServiceListUserGrantsRequest,
} from "../legacy_v1/userGrantServiceListUserGrants.js"
import { usersGrantsCommandSupport } from "./usersGrantsCommandSupport.js"

type UsersGrantsListCommandFlags = {
  readonly baseUrl?: string
  readonly envFile?: string
  readonly limit?: string
  readonly offset?: string
  readonly organizationId?: string
  readonly output: "json" | "yaml"
  readonly profile?: string
  readonly project?: string
  readonly projectId?: string
  readonly requestFile?: string
  readonly requestJson?: string
  readonly token?: string
  readonly user?: string
  readonly userId?: string
}

export const usersGrantsListCommand: Command<ApplicationContext> = buildCommand<
  UsersGrantsListCommandFlags,
  [],
  ApplicationContext
>({
  func: async function (this: ApplicationContext, flags: UsersGrantsListCommandFlags) {
    const requestResult = await usersGrantsCommandSupport.requestParse({
      file: flags.requestFile,
      json: flags.requestJson,
    })
    if (!requestResult.success) {
      this.process.stderr.write(`${requestResult.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }
    if (
      requestResult.data !== undefined &&
      (flags.user !== undefined ||
        flags.userId !== undefined ||
        flags.project !== undefined ||
        flags.projectId !== undefined)
    ) {
      this.process.stderr.write("Do not combine a raw request with user or project selection flags\n")
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

    let request: UserGrantServiceListUserGrantsRequest
    if (requestResult.data !== undefined) {
      request = requestResult.data as UserGrantServiceListUserGrantsRequest
    } else {
      const userSpecified = flags.user !== undefined || flags.userId !== undefined
      let userId: string | undefined
      if (userSpecified) {
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
        userId = userIdResult.data
      }

      const limitResult = usersGrantsCommandSupport.numberParse(flags.limit, "limit", 100)
      if (!limitResult.success) {
        this.process.stderr.write(`${limitResult.errorMessage}\n`)
        this.process.exitCode = 1
        return
      }
      const offsetResult = usersGrantsCommandSupport.numberParse(flags.offset, "offset", 0)
      if (!offsetResult.success) {
        this.process.stderr.write(`${offsetResult.errorMessage}\n`)
        this.process.exitCode = 1
        return
      }

      const queries: UserGrantServiceListUserGrantsRequest["queries"][number][] = []
      if (configResult.data.projectId !== undefined) {
        queries.push({ projectIdQuery: { projectId: configResult.data.projectId } })
      }
      if (userId !== undefined) queries.push({ userIdQuery: { userId } })
      request = {
        queries,
        query: { asc: true, limit: limitResult.data, offset: offsetResult.data },
      }
    }

    const result = await userGrantServiceListUserGrants({
      config: configResult.data,
      request,
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
      ...usersGrantsCommandSupport.listFlags,
      ...usersGrantsCommandSupport.rawRequestFlags,
      ...usersGrantsCommandSupport.userFlags,
    },
  },
  docs: {
    brief: "List user project-role assignments",
    fullDescription:
      "Selection flags become Management v1 query filters: --user TEST-USER or --user-id ID filters by user, while --project NAME or --project-id ID filters by project. Raw requests must provide the complete search request and cannot be combined with selection flags.",
  },
})

import type { ApplicationContext, Command } from "@stricli/core"
import { buildCommand } from "@stricli/core"
import { credentialsConfigRead } from "../config/index.js"

type CredentialsGetCommandFlags = {
  readonly envFile?: string
  readonly field?: "password" | "userId" | "username"
  readonly output?: "json"
  readonly profile?: string
  readonly project?: string
}

const credentialsGetCommandFlags = {
  envFile: {
    brief: "Explicit .env file path",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "PATH",
  },
  field: {
    brief: "Return one credential field as a raw value",
    kind: "enum",
    optional: true,
    values: ["username", "password", "userId"],
  },
  output: {
    brief: "Return the complete credential entry",
    kind: "enum",
    optional: true,
    values: ["json"],
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
} as const

export const credentialsGetCommand: Command<ApplicationContext> = buildCommand<
  CredentialsGetCommandFlags,
  [string],
  ApplicationContext
>({
  func: async function (this: ApplicationContext, flags: CredentialsGetCommandFlags, testUserName: string) {
    const op = "credentialsGetCommand"
    if (flags.field === undefined && flags.output !== "json") {
      this.process.stderr.write(`${op}: Specify --field or --output json\n`)
      this.process.exitCode = 1
      return
    }

    const credentialsResult = await credentialsConfigRead({
      env: this.process.env,
      envFile: flags.envFile,
      profile: flags.profile,
      project: flags.project,
    })
    if (!credentialsResult.success) {
      this.process.stderr.write(`${credentialsResult.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    const testUser = credentialsResult.data.testUsers[testUserName]
    if (testUser === undefined) {
      this.process.stderr.write(`The test user "${testUserName}" was not found in the selected credentials\n`)
      this.process.exitCode = 1
      return
    }

    if (flags.field !== undefined) {
      this.process.stdout.write(`${testUser[flags.field]}\n`)
      return
    }

    this.process.stdout.write(`${JSON.stringify(testUser)}\n`)
  },
  parameters: {
    flags: credentialsGetCommandFlags,
    positional: {
      kind: "tuple",
      parameters: [
        {
          brief: "Named test user",
          parse: (input: string) => input,
          placeholder: "TEST-USER",
        },
      ],
    },
  },
  docs: {
    brief: "Get a local test-user credential",
    fullDescription:
      "Reads credentials from the central local configuration. Use --field for a raw username, password, or userId; use --output json for the complete entry. No token or network access is required.",
  },
})

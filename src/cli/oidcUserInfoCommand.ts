import { type ApplicationContext, buildCommand, type Command } from "@stricli/core"
import { type OidcUserInfoOptions, oidcUserInfo } from "../protocol/oidcUserInfo.js"
import { oidcUserInfoDiscoveryParse } from "../protocol/oidcUserInfoDiscoveryParse.js"
import { type OidcUserInfoOutputFormat, oidcUserInfoSerialize } from "../protocol/oidcUserInfoSerialize.js"

type OidcUserInfoCommandFlags = {
  readonly baseUrl?: string
  readonly clientId?: string
  readonly discoveryFile?: string
  readonly discoveryJson?: string
  readonly envFile?: string
  readonly expectedSubject?: string
  readonly output: OidcUserInfoOutputFormat
  readonly token?: string
}

const oidcUserInfoCommandFlags = {
  baseUrl: {
    brief: "ZITADEL base URL used only for shared environment configuration",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "URL",
  },
  clientId: {
    brief: "OIDC client identifier used to validate signed UserInfo responses",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "CLIENT_ID",
  },
  discoveryFile: {
    brief: "Read validated OIDC discovery metadata from a JSON file",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "PATH",
  },
  discoveryJson: {
    brief: "Provide validated OIDC discovery metadata as JSON",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "JSON",
  },
  envFile: {
    brief: "Explicit .env file path",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "PATH",
  },
  expectedSubject: {
    brief: "Expected sub claim when validating the UserInfo response",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "SUBJECT",
  },
  output: {
    brief: "Output format",
    default: "json",
    kind: "enum",
    values: ["json", "yaml"],
  },
  token: {
    brief: "Bearer token (overrides environment and env file)",
    kind: "parsed",
    optional: true,
    parse: (input: string) => input,
    placeholder: "TOKEN",
  },
} as const

/**
 * Standalone Stricli command for an OIDC UserInfo request.
 *
 * The discovery input must already have been validated by the discovery flow; this command never
 * constructs a UserInfo URL from the base URL.
 */
export const oidcUserInfoCommand: Command<ApplicationContext> = buildCommand<
  OidcUserInfoCommandFlags,
  [],
  ApplicationContext
>({
  func: async function (this: ApplicationContext, flags: OidcUserInfoCommandFlags) {
    const discoveryResult = await oidcUserInfoDiscoveryParse({
      file: flags.discoveryFile,
      json: flags.discoveryJson,
    })
    if (!discoveryResult.success) {
      this.process.stderr.write(`${discoveryResult.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    const requestOptions: OidcUserInfoOptions = {
      baseUrl: flags.baseUrl,
      client: flags.clientId === undefined ? undefined : { client_id: flags.clientId },
      discovery: discoveryResult.data,
      env: this.process.env,
      envFile: flags.envFile,
      expectedSubject: flags.expectedSubject,
      token: flags.token,
    }
    const result = await oidcUserInfo(requestOptions)
    if (!result.success) {
      this.process.stderr.write(`${result.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    const serialized = oidcUserInfoSerialize(result.data, flags.output)
    if (!serialized.success) {
      this.process.stderr.write(`${serialized.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    this.process.stdout.write(`${serialized.data}\n`)
  },
  parameters: {
    flags: oidcUserInfoCommandFlags,
  },
  docs: {
    brief: "Request OIDC UserInfo claims with a bearer token",
    fullDescription:
      "Pass validated discovery metadata with --discovery-json or --discovery-file. The userinfo_endpoint from that metadata is used verbatim. Credentials use flag, process environment, then the selected .env file precedence.",
  },
})

import type { ApplicationContext, Command } from "@stricli/core"
import { buildCommand } from "@stricli/core"
import { oauthTokenRequest } from "./oauthTokenRequest.js"
import { type OauthTokenRequestClientAuthentication } from "./oauthTokenRequestConfigCreate.js"
import { type OauthTokenRequestOutputFormat, oauthTokenRequestSerialize } from "./oauthTokenRequestSerialize.js"

type OauthTokenRequestCommandFlags = {
  readonly clientAuth?: OauthTokenRequestClientAuthentication
  readonly clientId?: string
  readonly clientSecret?: string
  readonly baseUrl?: string
  readonly deviceCode?: string
  readonly envFile?: string
  readonly field?: readonly string[]
  readonly grantType?: string
  readonly issuer?: string
  readonly output: OauthTokenRequestOutputFormat
}

const oauthTokenRequestCommandFieldsCreate = (
  fields: readonly string[],
  deviceCode?: string,
): URLSearchParams | string => {
  const parameters = new URLSearchParams()
  for (const field of fields) {
    const separator = field.indexOf("=")
    if (separator < 1) {
      return `Invalid --field value "${field}"; use name=value`
    }
    parameters.append(field.slice(0, separator), field.slice(separator + 1))
  }
  if (deviceCode !== undefined) {
    parameters.set("device_code", deviceCode)
  }
  return parameters
}

export const oauthTokenRequestCommand: Command<ApplicationContext> = buildCommand<
  OauthTokenRequestCommandFlags,
  [],
  ApplicationContext
>({
  func: async function (this: ApplicationContext, flags: OauthTokenRequestCommandFlags) {
    const parameters = oauthTokenRequestCommandFieldsCreate(flags.field ?? [], flags.deviceCode)
    if (typeof parameters === "string") {
      this.process.stderr.write(`${parameters}\n`)
      this.process.exitCode = 1
      return
    }

    const result = await oauthTokenRequest({
      clientAuth: flags.clientAuth,
      clientId: flags.clientId,
      clientSecret: flags.clientSecret,
      baseUrl: flags.baseUrl,
      env: this.process.env,
      envFile: flags.envFile,
      grantType: flags.grantType,
      issuer: flags.issuer,
      parameters,
    })
    if (!result.success) {
      this.process.stderr.write(`${result.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    const serialized = oauthTokenRequestSerialize(result.data, flags.output)
    if (!serialized.success) {
      this.process.stderr.write(`${serialized.errorMessage}\n`)
      this.process.exitCode = 1
      return
    }

    this.process.stdout.write(`${serialized.data}\n`)
  },
  parameters: {
    flags: {
      baseUrl: {
        brief: "OIDC issuer/base URL (overrides environment and env file)",
        kind: "parsed",
        optional: true,
        parse: (input: string) => input,
        placeholder: "URL",
      },
      clientAuth: {
        brief: "Token endpoint client authentication method",
        kind: "enum",
        optional: true,
        values: ["none", "client_secret_basic", "client_secret_post"],
      },
      clientId: {
        brief: "OAuth client ID",
        kind: "parsed",
        optional: true,
        parse: (input: string) => input,
        placeholder: "CLIENT_ID",
      },
      clientSecret: {
        brief: "OAuth client secret",
        kind: "parsed",
        optional: true,
        parse: (input: string) => input,
        placeholder: "CLIENT_SECRET",
      },
      deviceCode: {
        brief: "Device code (equivalent to --field device_code=...)",
        kind: "parsed",
        optional: true,
        parse: (input: string) => input,
        placeholder: "DEVICE_CODE",
      },
      envFile: {
        brief: "Explicit .env file path",
        kind: "parsed",
        optional: true,
        parse: (input: string) => input,
        placeholder: "PATH",
      },
      field: {
        brief: "Additional form field; repeat for every OAuth parameter (name=value)",
        kind: "parsed",
        optional: true,
        parse: (input: string) => input,
        placeholder: "NAME=VALUE",
        variadic: true,
      },
      grantType: {
        brief: "OAuth grant_type (also accepted as a form field)",
        kind: "parsed",
        optional: true,
        parse: (input: string) => input,
        placeholder: "GRANT_TYPE",
      },
      issuer: {
        brief: "OIDC issuer used for validated discovery",
        kind: "parsed",
        optional: true,
        parse: (input: string) => input,
        placeholder: "URL",
      },
      output: {
        brief: "Output format",
        default: "json",
        kind: "enum",
        values: ["json", "yaml"],
      },
    },
  },
  docs: {
    brief: "Request an OAuth token at the token endpoint from validated OIDC discovery",
    fullDescription:
      "The issuer is discovered through its OIDC well-known document and the returned token_endpoint is used verbatim. Supply any OAuth form field with --field; device-code requests use --grant-type urn:ietf:params:oauth:grant-type:device_code and --device-code.",
  },
})

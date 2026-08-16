# @adaptive-ds/zitadel-cli

Typed ZITADEL API client and CLI for stable APIs, OIDC/OAuth protocol operations, and two deliberately
isolated legacy v1 identity-provider operations.

[![npm](https://img.shields.io/npm/v/%40adaptive-ds%2Fzitadel-cli)](https://www.npmjs.com/package/@adaptive-ds/zitadel-cli)
[![license](https://img.shields.io/npm/l/%40adaptive-ds%2Fzitadel-cli)](./LICENSE)

## What it supports

The supported API contract is pinned to ZITADEL **v4.17.1**. Use ZITADEL v4.17.1 or newer. Newer instances
may work when their contracts remain compatible, but a changed API is not automatically added to this package's
catalog.

The catalog contains non-deprecated stable v2 services for:

- actions
- applications
- internal permissions
- organizations
- projects
- users

The package also provides OIDC discovery, OAuth device authorization, token requests, and UserInfo requests.
`legacy_v1` is a compatibility boundary, not general v1 support: only `AdminService.ListIDPs` and
`AdminService.AddGoogleProvider` are included. Beta, alpha, deprecated, and other v1 methods are excluded and
cannot be called through the catalog.

This is a client library and command-line tool, not a ZITADEL server or an interactive login browser. Review
the official [ZITADEL API reference](https://zitadel.com/docs/reference/api) and the output of `api describe`
before automating a destructive operation.

## Install

The package requires Node.js 22+ or Bun 1.3+.

```sh
bun add @adaptive-ds/zitadel-cli @adaptive-ds/result valibot
# or
npm install @adaptive-ds/zitadel-cli @adaptive-ds/result valibot
```

The CLI is included in the package:

```sh
bunx zitadel-cli --help
# or, after installing it in a project:
npx zitadel-cli --help
```

`@adaptive-ds/result` and `valibot` are peer dependencies for library consumers.

## Credentials and configuration

API and legacy v1 commands use:

```dotenv
ZITADEL_BASE_URL=https://instance.zitadel.cloud
ZITADEL_TOKEN=replace-with-a-bearer-token
```

For every setting, the precedence is explicit CLI flag/library option, then the process environment, then the
explicitly selected `.env` file passed with `--env-file` or `envFile`. There is **no implicit `.env` loading**.
For example:

```sh
zitadel-cli projects list \
  --request-file ./requests/list-projects.json \
  --base-url https://instance.zitadel.cloud \
  --token "$ZITADEL_TOKEN" \
  --env-file .env.local
```

The flags win over environment variables; environment variables win over values in `.env.local`. A selected
env file supports blank lines, `#` comments, optional `export`, quoted values, and inline comments on unquoted
values. Invalid entries and unclosed quotes are reported as errors. Keep token and client-secret files out of
source control.

OIDC commands use these recommended names (the `ZITADEL_*` aliases are accepted too):

| Purpose | Recommended variable | Accepted aliases |
| --- | --- | --- |
| Issuer | `OIDC_ISSUER` | `ZITADEL_OIDC_ISSUER`, `ZITADEL_BASE_URL` |
| Client ID | `OIDC_CLIENT_ID` | `ZITADEL_OIDC_CLIENT_ID`, `ZITADEL_CLIENT_ID` |
| Client secret | `OIDC_CLIENT_SECRET` | `ZITADEL_OIDC_CLIENT_SECRET`, `ZITADEL_CLIENT_SECRET` |
| Client authentication | `OIDC_CLIENT_AUTH` | `OIDC_CLIENT_AUTHENTICATION`, `ZITADEL_OIDC_CLIENT_AUTH`, `ZITADEL_OIDC_CLIENT_AUTHENTICATION`, `ZITADEL_CLIENT_AUTHENTICATION` |
| Grant type | `OIDC_GRANT_TYPE` | `ZITADEL_OIDC_GRANT_TYPE` |

Device authorization additionally accepts `OIDC_*`, `ZITADEL_OIDC_*`, and shorter `ZITADEL_*` forms for
`CLIENT_ID`, `CLIENT_SECRET`, `CLIENT_AUTHENTICATION`, `DEVICE_AUTHORIZATION_ENDPOINT`, `SCOPE`, `RESOURCE`,
`AUTHORIZATION_DETAILS`, and `PARAMETERS_JSON`. CLI flags still take precedence over all of them.

## JSON and YAML

Commands return pretty JSON by default. Add `--output yaml` to API, endpoint, metadata, discovery, device
authorization, token, or UserInfo commands. The only supported output formats are `json` and `yaml`.

## An AI-efficient API workflow

Do not guess protobuf fields or duplicate a large request schema in a prompt or shell wrapper. Ask the catalog
for the smallest useful metadata, inspect the generated request descriptor, then call the method:

```sh
# 1. Find supported services/methods. Filter early when the catalog is large.
zitadel-cli api list --api-version v2 --service ProjectService

# 2. Inspect the exact request/response fields and official reference URL.
zitadel-cli api describe ProjectService.ListProjects --output yaml

# 3. Send the complete protobuf JSON request, inline or from a file (never both).
zitadel-cli api call ProjectService.ListProjects \
  --request-json '{"pagination":{"limit":25}}' \
  --base-url https://instance.zitadel.cloud \
  --token "$ZITADEL_TOKEN"
```

`api describe` accepts a short service/method name or a fully qualified target such as
`zitadel.project.v2.ProjectService.ListProjects`. Method metadata includes request and response descriptors,
the official ZITADEL reference URL, API version, and policy metadata. `api call` only invokes catalog-supported
unary methods. Use `--request-file ./request.json` for repeatable or reviewed requests.

The same guide is available in [`docs/api-discovery.md`](./docs/api-discovery.md).

## CLI groups

Run `zitadel-cli --help` or `zitadel-cli <group> --help` for the complete command tree. The implemented groups
are:

- `api`: list, describe, and call the policy-filtered catalog.
- `actions`: targets, executions, execution functions/methods/services, and public keys.
- `applications`: application lifecycle, keys, and client-secret operations.
- `internal-permissions`: administrator lifecycle operations.
- `organizations`: organization lifecycle, domains, validation, and metadata.
- `projects`: project lifecycle, grants, and roles.
- `users`: user lifecycle, metadata, IDP links, OTP/TOTP/U2F/passkeys, recovery codes, secrets, keys, personal
  access tokens, invite codes, and verification operations.
- `protocol`: discovery, device authorization, token, and UserInfo.
- `legacy-v1`: the two approved compatibility operations only.

All generated API groups use the same request/configuration pattern:

```sh
zitadel-cli applications list --request-file ./requests/list-applications.json
zitadel-cli organizations domains list --request-file ./requests/list-domains.json --output yaml
zitadel-cli users list --request-file ./requests/list-users.json
zitadel-cli actions targets list --request-file ./requests/list-targets.json
```

The request files contain the complete generated protobuf JSON shape. The endpoint-specific Markdown files in
[`docs/`](./docs/) link to official references and show representative request shapes.

### OIDC and device flow

Discovery is public and validates the issuer and provider metadata:

```sh
zitadel-cli protocol discovery \
  --base-url https://instance.zitadel.cloud \
  --output json > oidc-discovery.json
```

Device authorization is a separate, non-interactive request. Use the validated
`device_authorization_endpoint` from the discovery document:

```sh
DEVICE_AUTHORIZATION_ENDPOINT="$(jq -er '.device_authorization_endpoint' oidc-discovery.json)"
DEVICE_CODE="$(
  zitadel-cli protocol device-authorization \
    --device-authorization-endpoint "$DEVICE_AUTHORIZATION_ENDPOINT" \
    --client-id "$OIDC_CLIENT_ID" \
    --scope 'openid profile' \
    | tee /tmp/zitadel-device.json \
    | jq -r '.device_code'
)"
```

After the user completes verification, exchange the device code in a separate request:

```sh
zitadel-cli protocol token \
  --issuer https://instance.zitadel.cloud \
  --client-id "$OIDC_CLIENT_ID" \
  --grant-type urn:ietf:params:oauth:grant-type:device_code \
  --device-code "$DEVICE_CODE"
```

The device command does not open a browser or poll the token endpoint. `protocol token` performs one token
request; callers own any retry/polling policy. `protocol userinfo` consumes a discovery JSON/file and a bearer
token, and uses the validated `userinfo_endpoint` verbatim:

```sh
zitadel-cli protocol userinfo \
  --discovery-file ./oidc-discovery.json \
  --token "$ACCESS_TOKEN"
```

Use `--client-auth none`, `client_secret_basic`, or `client_secret_post` where appropriate. The token command
accepts repeated `--field NAME=VALUE` flags for additional OAuth parameters.

### Legacy v1 isolation

The compatibility commands are explicit and namespaced:

```sh
zitadel-cli legacy-v1 list-idps --request-file ./requests/list-idps.json
zitadel-cli legacy-v1 add-google-provider --request-file ./requests/add-google-provider.json
```

They use the generated v1 protobuf shapes but are not mixed into the v2 service exports. Other v1 methods,
deprecated methods, alpha methods, and beta methods are rejected by the policy-filtered catalog.

## Library

The root export includes catalog/discovery, configuration, JSON/YAML serialization, OIDC/OAuth protocol helpers,
typed v2 service wrappers, request parsers, generated descriptors, and types. Service-specific entry points are
also available from `@adaptive-ds/zitadel-cli/v2`, `@adaptive-ds/zitadel-cli/protocol`, and
`@adaptive-ds/zitadel-cli/legacy_v1`.

Fallible library operations return `Result<T>` or `PromiseResult<T>` from `@adaptive-ds/result`; inspect
`success` rather than relying on thrown transport or validation errors:

```ts
import {
  ListProjectsResponseSchema,
  messageSerialize,
  projectServiceListProjects,
} from "@adaptive-ds/zitadel-cli"

const result = await projectServiceListProjects({
  baseUrl: process.env.ZITADEL_BASE_URL,
  token: process.env.ZITADEL_TOKEN,
  request: { pagination: { limit: 25 } },
})

if (!result.success) {
  console.error(`${result.op}: ${result.errorMessage}`)
  process.exitCode = 1
} else {
  const output = messageSerialize(ListProjectsResponseSchema, result.data, "yaml")
  if (!output.success) {
    console.error(`${output.op}: ${output.errorMessage}`)
    process.exitCode = 1
  } else {
    console.log(output.data)
  }
}
```

OIDC discovery is also Result-based and validates the provider configuration before returning it:

```ts
import { oidcDiscovery } from "@adaptive-ds/zitadel-cli"

const discovery = await oidcDiscovery({
  baseUrl: "https://instance.zitadel.cloud",
})

if (!discovery.success) {
  console.error(`${discovery.op}: ${discovery.errorMessage}`)
} else {
  console.log(discovery.data.issuer, discovery.data.token_endpoint)
}
```

`zitadelConfigCreate`, `apiCall`, `apiCatalogList`, `apiMethodDescribe`, `deviceAuthorizationRequest`,
`oauthTokenRequest`, and `oidcUserInfo` are exported for composing the same workflows without the CLI. Inject a
custom `fetch` or Connect transport in library options when tests or a custom runtime need one.

## Generated sources

`src/generated/` is generated from the pinned ZITADEL protobuf tarball in [`buf.gen.yaml`](./buf.gen.yaml).
Do not hand-edit generated contracts. To intentionally update the contract, change the pinned upstream input,
run:

```sh
bun run generate:proto
```

Then review generated diffs, the policy-filtered catalog, official documentation URLs, and all checks. Generated
files are excluded from Biome formatting but are required for type checking and builds.

## Development and release

```sh
bun install
bun run dev             # run the CLI from source
bun run generate:proto  # regenerate pinned protobuf/Connect sources
bun run format          # format source, tests, and configuration
bun run format:check
bun run type-check
bun run test
bun run test:w
bun run build           # clean dist/ and emit JS, declarations, and maps
bun run deploy          # format check, type-check, tests, and build
```

`bun run release [version]` runs the build, creates a changelog from Git history, updates the package version,
commits and tags on `main`, pushes the branch and tags, and creates the GitHub release. It requires authenticated
`gh` and `git cliff`. The release script does not run `npm publish`; publish the package through the repository's
configured package-publishing workflow after the preflight.

## License

MIT © David Siewert. See [`LICENSE`](./LICENSE).

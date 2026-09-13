# Central configuration and user access

Central configuration lets one Linux user keep ZITADEL organizations, projects, bearer tokens, and shared test
identities in one place. The CLI reads these files locally; credential lookup does not make a network request.

## File layout

The root is `$XDG_CONFIG_HOME/zitadel-cli`. If `XDG_CONFIG_HOME` is unset or empty, the root is
`$HOME/.config/zitadel-cli` (using the operating-system home directory when `HOME` is also unavailable).

```text
$XDG_CONFIG_HOME/zitadel-cli/
├── config.json
├── credentials/
│   └── contentoren.json
└── projects/
    └── application.json
```

The names `contentoren` and `application` are examples. Names used for profile and project files must be safe file
names (`A-Z`, `a-z`, digits, `.`, `_`, and `-`; they must start with a letter or digit).

`config.json` contains the default profile and the organization-level profile settings:

```json
{
  "defaultProfile": "contentoren",
  "profiles": {
    "contentoren": {
      "baseUrl": "https://instance.zitadel.cloud",
      "organizationId": "123456789012345678"
    }
  }
}
```

`credentials/{profile}.json` contains the bearer token and shared test users directly. It has no profile or
ZITADEL wrapper:

```json
{
  "token": "replace-with-a-bearer-token",
  "testUsers": {
    "admin": {
      "userId": "234567890123456789",
      "username": "admin@example.test",
      "password": "replace-with-the-test-password"
    }
  }
}
```

Credential files must be private: create them with mode `0600` and do not commit them. The loader rejects files with
any group or other permission bits (for example, `0640` and `0644`). Errors for invalid or unreadable files do not
include file contents, passwords, or bearer tokens. The token is used for API commands but is never printed by
ordinary CLI diagnostics or by `credentials get`.

`projects/{project-name}.json` is flat and contains the profile to use and the ZITADEL project ID:

```json
{
  "profile": "contentoren",
  "projectId": "345678901234567890"
}
```

No project-local `.env` or extra project configuration file is required.

## Selection and precedence

API commands and `users grants` accept the following central configuration flags:

```text
--base-url URL
--organization-id ID
--project-id ID
--token TOKEN
--project NAME
--profile NAME
--env-file PATH
```

The corresponding process/environment-file variables are `ZITADEL_BASE_URL`, `ZITADEL_ORGANIZATION_ID`,
`ZITADEL_PROJECT_ID`, `ZITADEL_TOKEN`, `ZITADEL_PROJECT`, and `ZITADEL_PROFILE`. `--env-file` is explicit; the CLI
does not load `.env` implicitly. The same names are accepted by library options as `baseUrl`, `organizationId`,
`projectId`, `token`, `project`, `profile`, `envFile`, and `env`.

Values resolve in this order, from highest to lowest priority:

1. Explicit CLI flags or library options.
2. The process environment (`env` supplied to a library call, or `process.env` by default).
3. Values from the explicitly supplied env file.
4. The selected project file (`projects/{name}.json`).
5. The selected profile in `config.json`.
6. Defaults: `defaultProfile` selects the profile when no profile is otherwise selected; list commands use `limit=100`,
   `offset=0`, and ascending order.

`--project NAME` / `ZITADEL_PROJECT` select a project file. That file selects its profile unless an explicit
`--profile NAME`, `profile` option, `ZITADEL_PROFILE`, or env-file `ZITADEL_PROFILE` wins. An explicit profile always
overrides the selected project's profile. Project and profile selection are independent of explicit base URL,
organization ID, project ID, and token overrides.

For example, this uses the project ID from the project file but overrides its profile and token:

```sh
zitadel-cli users grants list \
  --project application \
  --profile contentoren \
  --token "$ZITADEL_TOKEN" \
  --user-id 234567890123456789
```

The existing explicit library configuration behavior is preserved. Passing `config: { baseUrl, token, ... }` to a
library operation validates and uses that object directly; it does not read env files or central files. API commands
without a complete explicit/central configuration return a diagnostic for the missing required base URL or token and
do not contact the network.

## Local credential lookup

Use a test-user alias from the selected profile, project, or default profile:

```sh
zitadel-cli credentials get admin --field username
zitadel-cli credentials get admin --field password --project application
zitadel-cli credentials get admin --field userId --profile contentoren
zitadel-cli credentials get admin --output json
```

`--field` accepts exactly `username`, `password`, or `userId` and writes only the raw value. `--output json` writes
the selected user's complete `{ password, userId, username }` entry; it does not write the profile token. Use one
of `--field` or `--output json`. Missing profiles, users, fields, invalid JSON, invalid credential shapes, and
non-private files fail with a non-zero exit status and a diagnostic that does not disclose secret values.

The equivalent public loaders return `PromiseResult` values and are exported from both the package root and
`@adaptive-ds/zitadel-cli/config`:

```ts
import {
  centralConfigRead,
  credentialsConfigRead,
  profileConfigRead,
  projectConfigRead,
  testUserIdResolve,
  zitadelConfigCreate,
  zitadelConfigResolve,
} from "@adaptive-ds/zitadel-cli/config"

const selection = { project: "application", envFile: ".env.test" }
const resolved = await zitadelConfigResolve(selection)
const apiConfig = await zitadelConfigCreate(selection)
const credentials = await credentialsConfigRead(selection)
const profile = await profileConfigRead({ profile: "contentoren" })
const project = await projectConfigRead({ project: "application" })
const central = await centralConfigRead()
const userId = await testUserIdResolve({ ...selection, user: "admin" })
```

Each result must be checked for `success` before reading `data`. The public declarations also include the typed
schemas and options (`CentralConfig`, `ProfileConfig`, `ProjectConfig`, `CredentialsConfig`, `TestUser`,
`ZitadelConfig`, `ZitadelConfigResolution`, and their loader option types), `zitadelConfigPaths`,
`zitadelConfigPath`, and `configJsonFileRead`.

## Shared users and project grants

Test users are shared human identities belonging to an organization. A test administrator is not an organization
administrator. Project roles and user-project assignments belong to individual projects, so the same user alias can
have different role assignments in different projects.

The alias passed to `--user` is resolved locally to its `userId` from the selected credentials. Use `--user-id` to
bypass credential lookup. They are mutually exclusive:

```sh
zitadel-cli users grants add \
  --user admin \
  --project application \
  --role-key reader \
  --role-key writer

zitadel-cli users grants list --project application --user admin
zitadel-cli users grants list --project-id 345678901234567890 --user-id 234567890123456789
```

`--role-key` and `--role-keys` may be repeated or supplied as comma-separated values. Structured commands use these
forms:

```text
users grants add     --user ALIAS|--user-id ID --project NAME|--project-id ID --role-key ROLE [...]
users grants list    [--user ALIAS|--user-id ID] [--project NAME|--project-id ID] [--limit N] [--offset N]
users grants update  --grant-id ID --user ALIAS|--user-id ID --role-key ROLE [...]
users grants remove  --grant-id ID --user ALIAS|--user-id ID
```

All four commands also accept `--base-url`, `--organization-id`, `--project-id`, `--token`, `--profile`,
`--project`, `--env-file`, and `--output json|yaml` as applicable. Add, list, and update accept either
`--request-json JSON` or `--request-file PATH` for a complete raw Management v1 request, never both. Raw add/update
requests cannot be combined with role flags; raw list requests cannot be combined with user or project selection
flags. This preserves explicit request compatibility for callers that need the exact protobuf JSON shape.

Assignment semantics are deliberate:

- `add` creates an assignment with the supplied `projectId` and role keys.
- `update` replaces the complete assignment role-key set; it does not add one role. To remove one role, update with
  the remaining role keys.
- `list` sends a Management v1 search request. Structured filters use protobuf JSON entries such as
  `queries: [{ "projectIdQuery": { "projectId": "..." } }, { "userIdQuery": { "userId": "..." } }]` and
  `query: { "asc": true, "limit": 100, "offset": 0 }`.
- `remove` deletes the entire assignment. It sends `DELETE /management/v1/users/{userId}/grants/{grantId}` with
  path components URL-encoded; it does not remove only one role.

The corresponding typed library APIs are exported from `@adaptive-ds/zitadel-cli/legacy_v1` (and the individual
user-grant modules). Their exported option/request types are `UserGrantServiceAddUserGrantOptions`,
`UserGrantServiceAddUserGrantRequest`, `UserGrantServiceListUserGrantsOptions`,
`UserGrantServiceListUserGrantsRequest`, `UserGrantServiceListUserGrantsResponse`, `UserGrantSearchQuery`,
`UserGrant`, `UserGrantState`, `UserGrantServiceUpdateUserGrantOptions`, and
`UserGrantServiceUpdateUserGrantRequest` (plus `UserGrantServiceDeleteUserGrantOptions`):

```ts
import {
  userGrantServiceAddUserGrant,
  userGrantServiceDeleteUserGrant,
  userGrantServiceListUserGrants,
  userGrantServiceUpdateUserGrant,
} from "@adaptive-ds/zitadel-cli/legacy_v1"

const common = { baseUrl, token, organizationId, userId: "234567890123456789" }
await userGrantServiceAddUserGrant({
  ...common,
  request: { projectId: "345678901234567890", roleKeys: ["reader"] },
})
await userGrantServiceListUserGrants({
  baseUrl,
  token,
  organizationId,
  request: {
    queries: [{ projectIdQuery: { projectId: "345678901234567890" } }],
    query: { asc: true, limit: 100, offset: 0 },
  },
})
await userGrantServiceUpdateUserGrant({
  ...common,
  grantId: "grant-id",
  request: { roleKeys: ["reader", "writer"] },
})
await userGrantServiceDeleteUserGrant({ ...common, grantId: "grant-id" })
```

These adapters use the stable available Management v1 endpoints; the inspected upstream checkout does not provide a
stable v2 authorization service definition. They return `PromiseResult` values and do not create identities, reset
passwords, open a browser, or enforce application authorization.

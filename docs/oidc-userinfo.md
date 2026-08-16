# OIDC UserInfo

The endpoint-owned `oidcUserInfo` function sends a GET request to the
`userinfo_endpoint` provided by validated OIDC discovery metadata. It does not
derive or replace that URL from `ZITADEL_BASE_URL`. The access token is sent
only as an HTTP bearer token.

```ts
import { oidcUserInfo } from "./src/protocol/oidcUserInfo.js"

const result = await oidcUserInfo({
  discovery,
  token: "access-token",
})

if (result.success) {
  console.log(result.data.sub)
}
```

Credentials reuse the existing configuration precedence: explicit `token`,
`ZITADEL_TOKEN` from the process environment, then `ZITADEL_TOKEN` from the
selected `.env` file. All failures are returned through the Result API.

The standalone Stricli command is exported from
`src/cli/oidcUserInfoCommand.ts`. Supply validated discovery JSON with either
`--discovery-json` or `--discovery-file`, and select `--output json` (default)
or `--output yaml`.

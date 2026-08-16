# OAuth token request

`oauthTokenRequest` performs a form-encoded OAuth token request after fetching
and validating the issuer's OIDC discovery document. The request always uses
the validated `token_endpoint` from that document; callers cannot replace it
with an arbitrary endpoint.

When discovery was already obtained with `oidcDiscovery`, pass its validated
response as `discovery` to avoid fetching it again:

```ts
const result = await oauthTokenRequest({
  clientId: "my-public-client",
  discovery: discoveryResult.data,
  grantType: "refresh_token",
  parameters: { refresh_token: "refresh-token" },
})
```

The request accepts arbitrary OAuth form fields, so device-code, authorization
code, refresh-token, token-exchange, and other standard grants do not require
new library options for each field:

```ts
import { oauthTokenRequest } from "./src/protocol/oauthTokenRequest.js"

const result = await oauthTokenRequest({
  clientId: "my-public-client",
  grantType: "urn:ietf:params:oauth:grant-type:device_code",
  issuer: "https://example.zitadel.cloud",
  parameters: {
    device_code: "device-code-from-device-authorization",
    scope: "openid profile",
  },
})
```

`clientAuth` supports `none`, `client_secret_post`, and
`client_secret_basic`. A library caller may provide `clientAuthentication` for
an OAuth-compatible custom authentication function.

The standalone `oauthTokenRequestCommand` accepts repeated `--field
name=value` flags and `--output json|yaml`. Its intended registration is:

```text
zitadel-cli ... oauthTokenRequestCommand --issuer ... \
  --client-id my-public-client \
  --grant-type urn:ietf:params:oauth:grant-type:device_code \
  --device-code device-code
```

Configuration follows the CLI's existing precedence: explicit options, process
environment, then the selected `--env-file`. The following names are
recognized: `OIDC_ISSUER` (or `ZITADEL_OIDC_ISSUER`/
`ZITADEL_BASE_URL`), `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`,
`OIDC_CLIENT_AUTH`, and `OIDC_GRANT_TYPE`, with `ZITADEL_` equivalents.

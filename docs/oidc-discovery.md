# OIDC provider discovery

This endpoint exposes a public Result-based library operation and standalone Stricli command for the OIDC discovery request:
`GET /.well-known/openid-configuration`.

Official references: <https://openid.net/specs/openid-connect-discovery-1_0-errata2.html#ProviderConfig> and <https://zitadel.com/docs/apis/openidoauth>

## CLI

Compose `oidcDiscoveryCommand` into a Stricli route map, then run:

```sh
zitadel-cli oidc-discovery --base-url https://example.zitadel.cloud --output json
zitadel-cli oidc-discovery --env-file .env.test --output yaml
```

The base URL precedence is flag, process environment, then the explicitly selected `.env` file. Set `ZITADEL_BASE_URL`; no token is required because discovery is public.

## Library

```ts
import { oidcDiscovery } from "@adaptive-ds/zitadel-cli/oidcDiscovery.js"

const result = await oidcDiscovery({
  env: process.env,
  envFile: ".env.test",
})

if (result.success) {
  console.log(result.data.issuer)
}
```

The response is validated against the required OIDC provider metadata fields and preserves additional provider metadata fields.

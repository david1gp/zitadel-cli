# OAuth device authorization

`deviceAuthorizationRequest` implements the OAuth 2.0 Device Authorization Grant (RFC 8628, section 3.1).
It does not perform discovery. Supply the `device_authorization_endpoint` from a separately validated OIDC discovery
response; the endpoint is validated as a URL before the request is sent.

The request is POSTed as `application/x-www-form-urlencoded`. It always sends `client_id` and includes the supplied
standard options (`scope`, repeated `resource`, and `authorization_details`) plus any additional string parameters.
Public clients use `none` authentication by default. A client secret can use `client_secret_post` or
`client_secret_basic`.

## Library

```ts
import { deviceAuthorizationRequest } from "./src/protocol/deviceAuthorizationRequest.js"

const result = await deviceAuthorizationRequest({
  clientId: "my-client",
  deviceAuthorizationEndpoint: discovery.device_authorization_endpoint,
  scope: "openid profile",
})

if (result.success) {
  console.log(result.data.verification_uri_complete ?? result.data.verification_uri)
}
```

The function returns `Result<DeviceAuthorizationResponse>` and accepts an injected `fetch` for tests. Transport,
HTTP, protocol, and response validation failures are returned as Result errors.

## CLI command

The standalone Stricli command is exported from
`src/protocol/deviceAuthorizationCommand.ts`; it is intentionally not added to the shared application route until
the protocol command set is assembled.

```sh
zitadel-cli --help
```

The command accepts `--device-authorization-endpoint`, `--client-id`, `--scope`, `--resource`,
`--authorization-details`, `--client-authentication`, `--client-secret`, `--parameters-json`, `--env-file`, and
`--output json|yaml`.

Configuration precedence is explicit flags, process environment, then the selected `.env` file. Supported variables
include:

```dotenv
ZITADEL_OIDC_DEVICE_AUTHORIZATION_ENDPOINT=https://issuer.example/oauth/v2/device_authorization
ZITADEL_OIDC_CLIENT_ID=my-client
ZITADEL_OIDC_SCOPE=openid profile
ZITADEL_OIDC_CLIENT_AUTHENTICATION=none
```

The `ZITADEL_OIDC_*` names also have unprefixed `OIDC_*` and shorter `ZITADEL_*` aliases for endpoint, client,
secret, scope, resource, authentication, authorization details, and additional parameters.

References: [RFC 8628](https://www.rfc-editor.org/rfc/rfc8628.html#section-3.1),
[OAuth 2.0 Authorization Server Metadata](https://www.rfc-editor.org/rfc/rfc8414.html), and
[ZITADEL OIDC documentation](https://zitadel.com/docs/guides/integrate/login/oidc).

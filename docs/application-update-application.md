# `ApplicationService.UpdateApplication`

This slice exposes the stable v2 `ApplicationService.UpdateApplication` operation through the typed library and `zitadel-cli applications update` command.

Official reference: <https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.UpdateApplication>

## Request discovery

The request is the generated `UpdateApplicationRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli applications update \
  --request-json '{"applicationId":"application-id","projectId":"project-id","name":"Updated application"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

## OIDC token assertions

For an OIDC application, configure JWT access tokens and role assertions by passing the generated OIDC field names:

```sh
zitadel-cli applications update \
  --request-json '{"applicationId":"application-id","projectId":"project-id","name":"Updated application","oidcConfiguration":{"accessTokenType":"OIDC_TOKEN_TYPE_JWT","accessTokenRoleAssertion":true,"idTokenUserinfoAssertion":false,"additionalOrigins":["https://app.example.test"]}}'
```

`OIDC_TOKEN_TYPE_JWT` is required for access-token role assertions; bearer access tokens are opaque. To include user roles, request them by scope or enable the project's role assertion setting first:

```sh
zitadel-cli projects update \
  --request-json '{"projectId":"project-id","projectRoleAssertion":true}'
```

The user must have the relevant project roles assigned. `idTokenUserinfoAssertion` adds profile, email, address, and phone claims to the ID token even when an access token is issued, and violates the OIDC specification, so the example explicitly disables it. Omitted optional fields remain unchanged; supplied repeated fields such as `additionalOrigins` replace the existing list.

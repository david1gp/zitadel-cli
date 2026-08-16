# `UserService.StartIdentityProviderIntent`

This slice exposes the stable v2 `UserService.StartIdentityProviderIntent` operation through the typed library and its endpoint command.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.StartIdentityProviderIntent>

## Request discovery

The request is the generated `StartIdentityProviderIntentRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli users start-identity-provider-intent \
  --request-json '{"idpId":"idp-1","urls":{"successUrl":"https://example.test/success","failureUrl":"https://example.test/failure"}}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

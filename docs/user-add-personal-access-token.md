# `UserService.AddPersonalAccessToken`

This slice exposes the stable v2 `UserService.AddPersonalAccessToken` operation through the typed library and CLI command definition.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddPersonalAccessToken>

Personal access tokens can only be added to machine users. Store the returned token securely: ZITADEL does not provide it again after creation.

## Request discovery

The request is the generated `AddPersonalAccessTokenRequest` protobuf shape with `userId` and optional `expirationDate` fields. Pass protobuf JSON directly:

```sh
zitadel-cli users add-personal-access-token \
  --request-json '{"userId":"machine-user-1","expirationDate":"2030-01-01T00:00:00Z"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

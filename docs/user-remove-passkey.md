# `UserService.RemovePasskey`

This slice exposes the stable v2 `UserService.RemovePasskey` operation through the typed library and `zitadel-cli users remove-passkey` command.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemovePasskey>

## Request discovery

The request is the generated `RemovePasskeyRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli users remove-passkey \
  --request-json '{"userId":"user-id","passkeyId":"passkey-id"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

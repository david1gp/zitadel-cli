# `UserService.AddKey`

This slice exposes the stable v2 `UserService.AddKey` operation through the typed library and CLI command definition.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddKey>

## Request discovery

The request is the generated `AddKeyRequest` protobuf shape. Pass protobuf JSON with the required `userId` and optional `expirationDate` or `publicKey`:

```sh
zitadel-cli users add-key \
  --request-json '{"userId":"user-1","publicKey":"AQI="}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

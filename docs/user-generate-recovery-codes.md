# `UserService.GenerateRecoveryCodes`

This slice exposes the stable v2 `UserService.GenerateRecoveryCodes` operation through the typed library and CLI command definition.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.GenerateRecoveryCodes>

## Request discovery

The request is the generated `GenerateRecoveryCodesRequest` protobuf shape with `userId` and `count` fields. Pass protobuf JSON directly:

```sh
zitadel-cli users generate-recovery-codes \
  --request-json '{"userId":"user-1","count":5}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

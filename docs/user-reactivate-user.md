# `UserService.ReactivateUser`

This slice exposes the stable v2 `UserService.ReactivateUser` operation through the typed library and `zitadel-cli users reactivate`.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ReactivateUser>

## Request discovery

The request is the generated `ReactivateUserRequest` protobuf shape and requires the user ID:

```sh
zitadel-cli users reactivate \
  --request-json '{"userId":"user-1"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

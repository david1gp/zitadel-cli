# `UserService.VerifyPhone`

This slice exposes the stable v2 `UserService.VerifyPhone` operation through the typed library and `zitadel-cli users verify-phone`.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyPhone>

## Request discovery

The request is the generated `VerifyPhoneRequest` protobuf shape with `userId` and `verificationCode` fields. Pass protobuf JSON directly:

```sh
zitadel-cli users verify-phone \
  --request-json '{"userId":"user-1","verificationCode":"123456"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

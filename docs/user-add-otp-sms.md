# `UserService.AddOTPSMS`

This slice exposes the stable v2 `UserService.AddOTPSMS` operation through the typed library and CLI command definition.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddOTPSMS>

## Request discovery

The request is the generated `AddOTPSMSRequest` protobuf shape. Pass protobuf JSON directly with the required `userId`:

```sh
zitadel-cli users add-otp-sms \
  --request-json '{"userId":"user-1"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

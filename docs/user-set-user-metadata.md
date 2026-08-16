# `UserService.SetUserMetadata`

This slice exposes the stable v2 `UserService.SetUserMetadata` operation through the typed library and `zitadel-cli users set-user-metadata` command.

Official reference: <https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.SetUserMetadata>

## Request discovery

The request is the generated `SetUserMetadataRequest` protobuf shape; no CLI field schema is duplicated. Metadata values must be base64 encoded in protobuf JSON:

```sh
zitadel-cli users set-user-metadata \
  --request-json '{"userId":"user-id","metadata":[{"key":"owner","value":"ZGF2aWQ="}]}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

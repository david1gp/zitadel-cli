# `ActionService.ListPublicKeys`

This slice exposes the stable v2 `ActionService.ListPublicKeys` operation through the typed library and the endpoint-owned `actions public-keys list` command.

Official reference: <https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListPublicKeys>

## Request discovery

The request is the generated `ListPublicKeysRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli actions public-keys list \
  --request-json '{"targetId":"target-1","pagination":{"limit":25},"sortingColumn":"PUBLIC_KEY_FIELD_NAME_EXPIRATION_DATE"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

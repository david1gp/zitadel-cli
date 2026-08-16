# `ActionService.UpdateTarget`

This slice exposes the stable v2 `ActionService.UpdateTarget` operation through the typed library and endpoint-owned `actions targets update` command.

Official reference: <https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.UpdateTarget>

## Request discovery

The request is the generated `UpdateTargetRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli actions targets update \
  --request-json '{"id":"target-id","name":"Updated target","endpoint":"https://example.test/action"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

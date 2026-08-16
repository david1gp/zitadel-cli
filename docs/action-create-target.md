# `ActionService.CreateTarget`

This slice exposes the stable v2 `ActionService.CreateTarget` operation through the typed library and the endpoint-owned `actions targets create` command.

Official reference: <https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.CreateTarget>

## Request discovery

The request is the generated `CreateTargetRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli actions targets create \
  --request-json '{"name":"Example","restWebhook":{"interruptOnError":true},"endpoint":"https://example.test/action","payloadType":"PAYLOAD_TYPE_JSON"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

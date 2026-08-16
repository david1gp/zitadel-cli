# `ActionService.DeactivatePublicKey`

This slice exposes the stable v2 `ActionService.DeactivatePublicKey` operation through the typed library and the endpoint-owned `actions targets deactivate-public-key` command.

Official reference: <https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.DeactivatePublicKey>

## Request discovery

The request is the generated `DeactivatePublicKeyRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli actions targets deactivate-public-key \
  --request-json '{"targetId":"target-1","keyId":"key-1"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

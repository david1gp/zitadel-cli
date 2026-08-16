# `ActionService.RemovePublicKey`

This slice exposes the stable v2 `ActionService.RemovePublicKey` operation through the typed library and `zitadel-cli actions remove-public-key`.

Official reference: <https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.RemovePublicKey>

Only inactive public keys can be removed. Removing a non-existing key is a no-op.

## Request discovery

The request is the generated `RemovePublicKeyRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli actions remove-public-key \
  --request-json '{"targetId":"target-1","keyId":"key-1"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

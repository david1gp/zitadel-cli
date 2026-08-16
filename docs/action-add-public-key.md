# `ActionService.AddPublicKey`

This slice exposes the stable v2 `ActionService.AddPublicKey` operation through the typed library and the endpoint-owned `actions targets add-public-key` command.

Official reference: <https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.AddPublicKey>

## Request discovery

The request is the generated `AddPublicKeyRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly. `publicKey` is a base64-encoded PEM public key in protobuf JSON:

```sh
zitadel-cli actions targets add-public-key \
  --request-json '{"targetId":"target-1","publicKey":"<base64-encoded-PEM>","expirationDate":"2030-01-01T00:00:00Z"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

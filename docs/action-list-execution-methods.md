# `ActionService.ListExecutionMethods`

This slice exposes the stable v2 `ActionService.ListExecutionMethods` operation through the typed library and the endpoint-owned `actions execution-methods list` command.

Official reference: <https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutionMethods>

## Request discovery

The request is the generated `ListExecutionMethodsRequest` protobuf shape; no CLI field schema is duplicated. The request has no fields, so invoke it with an empty protobuf JSON object:

```sh
zitadel-cli actions execution-methods list --request-json '{}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

# `ActionService.ListExecutionServices`

This slice exposes the stable v2 `ActionService.ListExecutionServices` operation through the typed library and the endpoint-owned `actions execution-services list` command.

Official reference: <https://zitadel.com/docs/reference/api/action/zitadel.action.v2.ActionService.ListExecutionServices>

The generated `ListExecutionServicesRequest` has no fields. Invoke it without a request or pass the empty protobuf JSON object:

```sh
zitadel-cli actions execution-services list --request-json '{}'
```

The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.

# ZITADEL protobuf source

The generation input is the ZITADEL `v4.17.1` release, resolved to commit
`a9311b8c702531832575351a663e98a2242778e5`. The immutable source archive and
the selected service types are recorded in `../buf.gen.yaml`.

Source: https://github.com/zitadel/zitadel/tree/v4.17.1/proto

The protobuf definitions are redistributed under the terms of the upstream
ZITADEL project license. See the upstream repository's `LICENSE` file:
https://github.com/zitadel/zitadel/blob/v4.17.1/LICENSE

The upstream `buf.lock` pins these imported modules:

- `envoyproxy/protoc-gen-validate` at `6607b10f00ed4a3d98f906807131c44a`
- `googleapis/googleapis` at `75b4300737fb4efca0831636be94e517`
- `grpc-ecosystem/grpc-gateway` at `a1ecdc58eccd49aa8bea2a7a9022dc27`

Generation is pinned to Buf `1.69.0`, Protobuf-ES `2.14.0`, and
Connect-ES `1.7.0` through `package.json` and `bun.lock`.

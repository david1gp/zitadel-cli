import { ScalarType, type DescField, type DescMessage } from "@bufbuild/protobuf"

export type ApiFieldDescription = {
  readonly deprecated: boolean
  readonly fieldKind: DescField["fieldKind"]
  readonly jsonName: string
  readonly localName: string
  readonly name: string
  readonly number: number
  readonly presence: DescField["presence"]
  readonly repeated: boolean
  readonly typeName: string
}

export type ApiMessageDescription = {
  readonly fields: readonly ApiFieldDescription[]
  readonly name: string
  readonly typeName: string
}

const scalarTypeNameCreate = (scalar: ScalarType) => ScalarType[scalar]

const fieldTypeNameCreate = (field: DescField): string => {
  if (field.fieldKind === "scalar") {
    return scalarTypeNameCreate(field.scalar)
  }
  if (field.fieldKind === "enum") {
    return field.enum.typeName
  }
  if (field.fieldKind === "message") {
    return field.message.typeName
  }
  if (field.fieldKind === "list") {
    if (field.listKind === "scalar") {
      return scalarTypeNameCreate(field.scalar)
    }
    if (field.listKind === "enum") {
      return field.enum.typeName
    }
    return field.message.typeName
  }
  if (field.mapKind === "scalar") {
    return scalarTypeNameCreate(field.scalar)
  }
  if (field.mapKind === "enum") {
    return field.enum.typeName
  }
  return field.message.typeName
}

export function apiMessageDescribe(message: DescMessage): ApiMessageDescription {
  return {
    fields: message.fields.map((field) => ({
      deprecated: field.deprecated,
      fieldKind: field.fieldKind,
      jsonName: field.jsonName,
      localName: field.localName,
      name: field.name,
      number: field.number,
      presence: field.presence,
      repeated: field.fieldKind === "list",
      typeName: fieldTypeNameCreate(field),
    })),
    name: message.name,
    typeName: message.typeName,
  }
}

export const apiPolicy = {
  deprecation: {
    deprecatedMethods: "excluded",
    description: "Deprecated methods are excluded from the supported catalog and cannot be called.",
    supportedMethods: "non-deprecated",
  },
  legacy: {
    description: "Only the explicitly approved legacy_v1 methods are included; other v1 methods are excluded.",
    isolation: "legacy_v1",
  },
  versions: ["v2", "legacy_v1"],
} as const

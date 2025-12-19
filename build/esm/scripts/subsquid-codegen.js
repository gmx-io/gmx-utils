// scripts/subsquid-codegen.ts
var config = {
  schema: "https://gmx.squids.live/gmx-synthetics-arbitrum:prod/api/graphql",
  overwrite: true,
  debug: true,
  generates: {
    "./src/codegen/subsquid.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        // Prevent duplicate types
        namingConvention: "keep",
        declarationKind: "interface",
        // Make BigInt output string instead of any
        scalars: {
          BigInt: {
            input: "number",
            output: "string"
          }
        },
        addEslintDisable: true
      }
    }
  }
};
var subsquid_codegen_default = config;

export { subsquid_codegen_default as default };
//# sourceMappingURL=subsquid-codegen.js.map
//# sourceMappingURL=subsquid-codegen.js.map
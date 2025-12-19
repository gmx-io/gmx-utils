import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 15000,
    exclude: ["**/build/**", "**/node_modules/**"],
    coverage: {
      exclude: [
        "**/abis/**",
        "**/scripts/**",
        "**/*.config.{js,ts,cjs}",
        "**/package.json",
        "**/yarn.lock",
        "**/tsconfig.json",
        "**/eslint*.{js,cjs,ts}",
      ],
    },
  },
  resolve: {
    alias: {
      domain: path.resolve(__dirname, "./src/domain"),
      lib: path.resolve(__dirname, "./src/lib"),
      "lib/*": path.resolve(__dirname, "./src/lib/*"),
      types: path.resolve(__dirname, "./src/types"),
      configs: path.resolve(__dirname, "./src/configs"),
      abis: path.resolve(__dirname, "./src/abis"),
      transactions: path.resolve(__dirname, "./src/transactions"),
      "utils/*": path.resolve(__dirname, "./src/lib/utils/*"),
      "codegen/*": path.resolve(__dirname, "./src/codegen/*"),
      test: path.resolve(__dirname, "./test"),
    },
  },
});

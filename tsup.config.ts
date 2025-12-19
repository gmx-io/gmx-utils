import { defineConfig } from "tsup";
import { TsconfigPathsPlugin } from '@esbuild-plugins/tsconfig-paths'

import { esbuildPluginFilePathExtensions } from "esbuild-plugin-file-path-extensions";
import path from "path";

export default defineConfig({
  entry: ["src/**/*.ts", "!src/**/*.spec.ts", "!src/**/*.test.ts", "scripts/**/*.ts"],
  format: ["esm"],
  
  // NOTE: Generating bundled .d.ts for every entry is extremely memory hungry and can OOM in tsup's dts worker.
  // We generate declarations via `tsc --emitDeclarationOnly` instead (see package.json).
  dts: false,
  outDir: "build/esm",
  bundle: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  esbuildPlugins: [
    TsconfigPathsPlugin({
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
    }),
    esbuildPluginFilePathExtensions({
      esmExtension: "js",
    }),
  ],
  esbuildOptions(options) {
    options.platform = "node";
    options.target = "es2022";
  },
});


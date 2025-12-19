import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import jsoncParser from "jsonc-eslint-parser";
import importPlugin from "eslint-plugin-import";
import packageJsonPlugin from "eslint-plugin-package-json";
import globals from "globals";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);
const localRulesPlugin = require("eslint-plugin-local-rules");
const localRules = require("./eslint-local-rules.cjs");

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

const tsConfigPath = resolve(__dirname, "tsconfig.json");

export default [
  {
    ignores: [
      "build/**",
      "node_modules/**",
      "*.config.ts",
      "*.config.js",
      "vitest.config.ts",
      "eslint-local-rules.cjs",
      "scripts/**/*.cjs",
    ],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:es-x/restrict-to-es2017",
    "prettier"
  ),
  {
    plugins: {
      "local-rules": {
        rules: localRules,
      },
      import: importPlugin,
      "package-json": packageJsonPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-undef": "error",
      "no-console": "warn",
      "no-var": "error",
      "no-case-declarations": "error",
      "no-constant-condition": [
        "error",
        {
          checkLoops: "all",
        },
      ],
      "@typescript-eslint/no-empty-function": "error",
      "no-extra-boolean-cast": "error",
      "no-prototype-builtins": "error",
      "no-empty": "error",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrors: "none",
          varsIgnorePattern: "^_",
        },
      ],
      "import/order": [
        "warn",
        {
          groups: [
            ["builtin", "external"],
            ["internal"],
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/namespace": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      curly: "off",
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "off",
      "no-irregular-whitespace": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-async-promise-executor": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "es-x/no-bigint": "off",
      "es-x/no-optional-chaining": "off",
      "es-x/no-import-meta": "off",
      "es-x/no-dynamic-import": "off",
      "es-x/no-class-instance-fields": "off",
      "es-x/no-class-static-fields": "off",
      "es-x/no-nullish-coalescing-operators": "off",
      "es-x/no-global-this": "off",
      "es-x/no-numeric-separators": "off",
      "es-x/no-rest-spread-properties": "off",
      "es-x/no-regexp-named-capture-groups": "off",
      "es-x/no-array-prototype-at": "off",
      "es-x/no-array-prototype-flat": "off",
      "es-x/no-object-fromentries": "off",
      "es-x/no-promise-prototype-finally": "off",
      "es-x/no-promise-any": "off",
      "es-x/no-promise-all-settled": "off",
      "es-x/no-promise-withresolvers": "off",
      "es-x/no-array-prototype-findlast-findlastindex": "off",
      "es-x/no-array-prototype-toreversed": "off",
      "no-restricted-imports": [
        "error",
        {
          paths: ["lodash"],
        },
      ],
      "no-restricted-globals": [
        "error",
        {
          name: "process",
          message: "Don't use `process` in client code",
        },
      ],
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },
  {
    files: ["*.ts", "*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    rules: {
      "no-undef": "off",
      "no-constant-condition": [
        "error",
        {
          checkLoops: "all",
        },
      ],
    },
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    rules: {
      "local-rules/no-bigint-negation": "error",
      "local-rules/no-logical-bigint": "error",
    },
  },
  {
    files: ["scripts/**"],
    rules: {
      "no-restricted-globals": "off",
    },
  },
  {
    files: ["package.json"],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      "package-json": packageJsonPlugin,
    },
    rules: {
      "package-json/valid-package-def": "error",
    },
  },
];

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundariesPlugin from "eslint-plugin-boundaries";
import perfectionist from "eslint-plugin-perfectionist";
import tsParser from "@typescript-eslint/parser";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  perfectionist.configs["recommended-natural"],
  {
    plugins: {
      boundaries: boundariesPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    settings: {
      "boundaries/elements": [
        {
          type: "shared",
          pattern: "src/shared/**/*",
        },
        {
          type: "domain",
          pattern: "src/contexts/*/domain/**/*",
          capture: ["context"],
        },
        {
          type: "application",
          pattern: "src/contexts/*/application/**/*",
          capture: ["context"],
        },
        {
          type: "infrastructure",
          pattern: "src/contexts/*/infrastructure/**/*",
          capture: ["context"],
        },
        {
          type: "app",
          pattern: "app/**/*",
        },
      ],
      "boundaries/ignore": ["**/*.spec.ts", "**/*.spec.tsx", "**/*.test.ts"],
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: [["domain"]],
              allow: [["domain", { context: "${from.context}" }], "shared"],
              message:
                "Domain layer can only import from domain in the SAME context and shared. Cross-context imports are forbidden.",
            },
            {
              from: [["application"]],
              allow: [
                ["domain", { context: "${from.context}" }],
                ["application", { context: "${from.context}" }],
                "shared",
              ],
              message:
                "Application layer can only import from domain and application in the SAME context, and shared. Cross-context imports are forbidden.",
            },
            {
              from: [["infrastructure"]],
              allow: [
                ["domain", { context: "${from.context}" }],
                ["application", { context: "${from.context}" }],
                ["infrastructure", { context: "${from.context}" }],
                "shared",
              ],
              message:
                "Infrastructure layer can only import from domain, application, and infrastructure in the SAME context, and shared. Cross-context imports are forbidden.",
            },
            {
              from: [["app"]],
              allow: ["infrastructure", "shared"],
              message:
                "App layer can only import from infrastructure and shared",
            },
          ],
        },
      ],
      "boundaries/no-unknown": ["error"],
      "boundaries/no-ignored": ["error"],
      "boundaries/entry-point": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              target: ["domain", "application", "infrastructure"],
              allow: "index.ts",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "*.config.js",
    "*.config.mjs",
    "*.config.ts",
  ]),
]);

export default eslintConfig;

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundariesPlugin from "eslint-plugin-boundaries";
import tsParser from "@typescript-eslint/parser";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
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
              from: "domain",
              allow: ["domain", "shared"],
            },
            {
              from: "application",
              allow: ["domain", "application", "shared"],
            },
            {
              from: "infrastructure",
              allow: ["domain", "application", "infrastructure", "shared"],
            },
            {
              from: "app",
              allow: ["infrastructure", "shared"],
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

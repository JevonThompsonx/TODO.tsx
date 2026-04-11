import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // ECC / tooling dirs — not app code
    "scripts/**",
    ".cursor/**",
    ".codebuddy/**",
    ".opencode/**",
    "skills/**",
    "examples/**",
    "agents/**",
    "commands/**",
    "hooks/**",
    "tests/ci/**",
    "tests/hooks/**",
    "tests/codex*",
    "tests/integration/**",
    "tests/lib/**",
    "tests/scripts/**",
    "tests/run-all.js",
    "tests/opencode*",
    "tests/plugin*",
  ]),
]);

export default eslintConfig;

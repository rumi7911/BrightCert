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
    // Sibling task worktrees live inside the repository root, so linting from
    // the main worktree would otherwise walk every other agent's branch and
    // report their findings as if they were ours.
    ".worktrees/**",
  ]),
]);

export default eslintConfig;

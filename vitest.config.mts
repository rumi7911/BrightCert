import { defaultExclude, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    clearMocks: true,
    environmentOptions: {
      jsdom: { url: "http://localhost/" },
    },
    // Sibling task worktrees live inside the repository root. Without this,
    // a run from the main worktree collects every other agent's branch and
    // reports their failures as ours. Spread the defaults rather than
    // replacing them, so node_modules and .git stay excluded.
    exclude: [...defaultExclude, "**/.worktrees/**"],
  },
});

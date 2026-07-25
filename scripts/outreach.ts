#!/usr/bin/env tsx

import { runCli } from "../src/lib/outreach/cli";

runCli(process.argv.slice(2)).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown operator error";
  console.error(`Outreach command failed: ${message}`);
  process.exitCode = 1;
});

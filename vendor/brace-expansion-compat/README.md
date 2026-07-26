# brace-expansion compatibility bridge

ESLint 9 and the plugins bundled by `eslint-config-next` still consume
minimatch 3, which expects `require("brace-expansion")` to return a callable
function. Current TypeScript-ESLint consumes minimatch 10, which expects the
named `expand` export. The security-fixed `brace-expansion` 5.0.8 release
provides only the modern named API.

This narrow CommonJS bridge delegates all expansion work and safety limits to
the unmodified upstream `brace-expansion` 5.0.8 package, then exposes both API
shapes. The root npm override routes only `brace-expansion` consumers through
the bridge. Remove it when every installed minimatch consumer supports the
modern API.

Upstream: <https://github.com/juliangruber/brace-expansion>

The upstream MIT licence and attribution are preserved in [LICENSE](./LICENSE).

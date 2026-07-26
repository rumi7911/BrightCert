"use strict";

// eslint-disable-next-line @typescript-eslint/no-require-imports -- this CommonJS bridge must serve legacy minimatch callers
const safeBraceExpansion = require("brace-expansion-safe");

function legacyExpand(pattern, options) {
  return safeBraceExpansion.expand(pattern, options);
}

module.exports = legacyExpand;
module.exports.expand = safeBraceExpansion.expand;
module.exports.EXPANSION_MAX = safeBraceExpansion.EXPANSION_MAX;
module.exports.EXPANSION_MAX_LENGTH =
  safeBraceExpansion.EXPANSION_MAX_LENGTH;

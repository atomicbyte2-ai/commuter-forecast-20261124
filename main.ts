// SPDX-License-Identifier: MIT
// Charm the Commuter: Forecast a City That Isn't — entry program.
// Writes the chosen one-line forecast to entry.txt in the output
// directory (MAKEFUN_OUTPUT_DIR, or /output by default) and keeps a
// copy as entry.txt next to this script. No network, no external
// input, no relative paths: every path is resolved from this file's
// own directory or from an absolute output directory.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The entry: one line, 140 characters at most.
// Drizminster is invented; the weather (drizzle till nine, then
// sunshine) is the whole point; the payoff is a small kindness aimed
// straight at the bored commuter — an early bus, a dry seat, and a
// Monday that has apologised.
const ENTRY =
  "In Drizminster, drizzle till nine, then sunshine — your bus is early, your seat is dry, and Monday has apologised.";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Gate: the bounty requires UTF-8 text of 1 to 140 characters, not
// only whitespace, and a single line. The forecast must also name its
// invented city — a forecast with no place in it is not a forecast
// for a city that does not exist.
if (ENTRY.length < 1 || ENTRY.length > 140) {
  throw new Error(`entry is ${ENTRY.length} characters; must be 1-140`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (ENTRY.trim() !== ENTRY) {
  throw new Error("entry must not start or end with whitespace");
}
if (!ENTRY.includes("Drizminster")) {
  throw new Error("entry must name its invented city");
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY, "utf8");
writeFileSync(join(scriptDir, "entry.txt"), ENTRY, "utf8");
// Round-trip check: what landed on disk must be byte-identical to the
// entry, with no trailing newline added by the write.
if (readFileSync(join(outputDir, "entry.txt"), "utf8") !== ENTRY) {
  throw new Error("written entry does not match the entry text");
}
console.log(`wrote ${ENTRY.length} characters to ${join(outputDir, "entry.txt")}`);

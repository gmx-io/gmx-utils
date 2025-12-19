#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const baselinePath = path.resolve(__dirname, "../coverage-baseline.json");
const currentPath = path.resolve(__dirname, "../coverage/coverage-final.json");

// Normalize file paths for comparison (handle absolute vs relative paths)
const normalizePath = (filePath) => {
  // Remove absolute path prefixes and normalize to relative path from src/
  const normalized = filePath.replace(/^.*\/src\//, "src/");
  return normalized;
};

// Create a normalized coverage map
const normalizeCoverage = (coverage) => {
  const normalized = {};
  for (const [filePath, data] of Object.entries(coverage)) {
    const normalizedPath = normalizePath(filePath);
    normalized[normalizedPath] = data;
  }
  return normalized;
};

const getFileCoverage = (coverage, filePath) => {
  const file = coverage[filePath];
  if (!file) return null;

  const statements = Object.values(file.statementMap).length;
  const coveredStatements = Object.values(file.s).filter((v) => v > 0).length;
  const branches = Object.values(file.branchMap).length;
  const coveredBranches = Object.values(file.b)
    .flat()
    .filter((v) => v > 0).length;
  const functions = Object.values(file.fnMap).length;
  const coveredFunctions = Object.values(file.f).filter((v) => v > 0).length;

  return {
    statements: statements > 0 ? (coveredStatements / statements) * 100 : 100,
    branches: branches > 0 ? (coveredBranches / branches) * 100 : 100,
    functions: functions > 0 ? (coveredFunctions / functions) * 100 : 100,
  };
};

if (!fs.existsSync(currentPath)) {
  console.error('❌ Coverage file not found. Run "yarn test:coverage" first.');
  process.exit(1);
}

const currentCoverageRaw = JSON.parse(fs.readFileSync(currentPath, "utf8"));
const currentCoverage = normalizeCoverage(currentCoverageRaw);

if (!fs.existsSync(baselinePath)) {
  console.log(
    "⚠️  No baseline found. Creating baseline from current coverage..."
  );
  fs.writeFileSync(baselinePath, JSON.stringify(currentCoverageRaw, null, 2));
  console.log(
    "✅ Baseline created. Commit this file to track coverage changes."
  );
  console.log(
    `📊 Baseline includes ${Object.keys(currentCoverage).length} files`
  );
  process.exit(0);
}

const baselineCoverageRaw = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const baselineCoverage = normalizeCoverage(baselineCoverageRaw);

const errors = [];
const warnings = [];

// Check each file in baseline
for (const [filePath] of Object.entries(baselineCoverage)) {
  const baseline = getFileCoverage(baselineCoverage, filePath);
  const current = getFileCoverage(currentCoverage, filePath);

  if (!current) {
    warnings.push(`${filePath}: File removed or not covered`);
    continue;
  }

  if (current.statements < baseline.statements - 1) {
    errors.push(
      `❌ ${filePath}: Statements coverage dropped from ${baseline.statements.toFixed(
        1
      )}% to ${current.statements.toFixed(1)}%`
    );
  }

  if (current.branches < baseline.branches - 1) {
    errors.push(
      `❌ ${filePath}: Branches coverage dropped from ${baseline.branches.toFixed(
        1
      )}% to ${current.branches.toFixed(1)}%`
    );
  }

  if (current.functions < baseline.functions - 1) {
    errors.push(
      `❌ ${filePath}: Functions coverage dropped from ${baseline.functions.toFixed(
        1
      )}% to ${current.functions.toFixed(1)}%`
    );
  }
}

if (warnings.length > 0) {
  console.log("\n⚠️  Warnings:");
  warnings.forEach((w) => console.log(w));
}

if (errors.length > 0) {
  console.error("\n❌ Coverage regression detected:\n");
  errors.forEach((e) => console.error(e));
  console.error(
    "\nPlease add tests to maintain coverage or update the baseline."
  );
  console.error("\nTo update the baseline, run: yarn coverage:baseline");
  process.exit(1);
}

const baselineFileCount = Object.keys(baselineCoverage).length;
const currentFileCount = Object.keys(currentCoverage).length;

if (currentFileCount < baselineFileCount) {
  console.warn(
    `\n⚠️  Warning: Current coverage has ${currentFileCount} files, baseline has ${baselineFileCount}`
  );
  console.warn("Some files may have been removed or are no longer covered.");
}

console.log(`Coverage check passed - no regressions detected`);
console.log(`Checked ${baselineFileCount} files from baseline`);
process.exit(0);

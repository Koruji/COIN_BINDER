#!/usr/bin/env node
// Builds a Markdown report (test results + coverage) from the Jest outputs.
// In CI it is appended to $GITHUB_STEP_SUMMARY; locally: `node scripts/ci-summary.js`.
//
//   reports/test-results.json     (jest --json)
//   coverage/coverage-summary.json (coverageReporters: json-summary)
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const { jest: jestConfig } = require(path.join(root, "package.json"));

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  } catch {
    return null;
  }
}

const icon = (ok) => (ok ? "✅" : "❌");
const lines = [];

// ---------- Tests ----------
const results = readJson("reports/test-results.json");
lines.push("## 🧪 Tests", "");

if (!results) {
  lines.push("_No test report found (tests did not run?)._", "");
} else {
  const groups = { unit: [], integration: [] };
  for (const file of results.testResults) {
    const rel = path.relative(root, file.name).split(path.sep).join("/");
    (rel.startsWith("tests/integration/") ? groups.integration : groups.unit).push({ ...file, rel });
  }

  lines.push("| Suite | Files | Passed | Failed | Skipped |", "|---|---:|---:|---:|---:|");
  for (const [name, files] of Object.entries(groups)) {
    const all = files.flatMap((f) => f.assertionResults);
    const count = (status) => all.filter((a) => a.status === status).length;
    const failed = count("failed");
    lines.push(
      `| ${icon(failed === 0)} ${name} | ${files.length} | ${count("passed")} | ${failed} | ${count("pending") + count("todo")} |`,
    );
  }
  lines.push(
    "",
    `**${results.numPassedTests}/${results.numTotalTests} tests passed** in ${results.numTotalTestSuites} files.`,
    "",
  );

  const failures = results.testResults.flatMap((f) =>
    f.assertionResults
      .filter((a) => a.status === "failed")
      .map((a) => ({ file: path.relative(root, f.name), title: a.fullName, message: a.failureMessages.join("\n") })),
  );
  if (failures.length > 0) {
    lines.push("### ❌ Failures", "");
    for (const f of failures) {
      const message = f.message.replace(/\u001b\[[0-9;]*m/g, "").slice(0, 1500);
      lines.push(`<details><summary><code>${f.file}</code> — ${f.title}</summary>`, "", "```", message, "```", "</details>", "");
    }
  }

  lines.push("<details><summary>Details per file</summary>", "", "| File | Tests | Status |", "|---|---:|---|");
  for (const f of [...groups.unit, ...groups.integration]) {
    lines.push(`| \`${f.rel}\` | ${f.assertionResults.length} | ${icon(f.status === "passed")} |`);
  }
  lines.push("", "</details>", "");
}

// ---------- Coverage ----------
const coverage = readJson("coverage/coverage-summary.json");
lines.push("## 📊 Coverage", "");

if (!coverage) {
  lines.push("_No coverage report found._", "");
} else {
  const thresholds = (jestConfig.coverageThreshold && jestConfig.coverageThreshold.global) || {};
  const metrics = [
    ["Statements", "statements"],
    ["Branches", "branches"],
    ["Functions", "functions"],
    ["Lines", "lines"],
  ];

  lines.push("| Metric | Covered | Total | Coverage | Threshold | |", "|---|---:|---:|---:|---:|:-:|");
  for (const [label, key] of metrics) {
    const { covered, total, pct } = coverage.total[key];
    const min = thresholds[key];
    const ok = min === undefined || pct >= min;
    lines.push(`| ${label} | ${covered} | ${total} | **${pct}%** | ${min === undefined ? "–" : `${min}%`} | ${icon(ok)} |`);
  }
  lines.push("");

  const files = Object.entries(coverage)
    .filter(([name]) => name !== "total")
    .map(([name, data]) => ({ rel: path.relative(root, name).split(path.sep).join("/"), data }))
    .sort((a, b) => a.data.lines.pct - b.data.lines.pct);

  lines.push("<details><summary>Coverage per file (lowest first)</summary>", "", "| File | Statements | Branches | Functions | Lines |", "|---|---:|---:|---:|---:|");
  for (const { rel, data } of files) {
    lines.push(`| \`${rel}\` | ${data.statements.pct}% | ${data.branches.pct}% | ${data.functions.pct}% | ${data.lines.pct}% |`);
  }
  lines.push("", "</details>", "", "_The full HTML report is available in the `coverage-report` artifact of the run._", "");
}

process.stdout.write(lines.join("\n") + "\n");

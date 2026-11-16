// Turns a vitest json-summary into test/<level>/evidence/coverage.md.
// Usage: node test/scripts/coverage-md.mjs <unit|integration>
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { relative } from 'node:path';

const level = process.argv[2];
if (!['unit', 'integration'].includes(level)) {
  console.error('usage: coverage-md.mjs <unit|integration>');
  process.exit(2);
}
const summaryPath = `coverage/${level}/coverage-summary.json`;
const resultsPath = `coverage/${level}/results.json`;
if (!existsSync(summaryPath)) {
  console.error(`missing ${summaryPath}; run vitest with --coverage first`);
  process.exit(1);
}
const summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
const results = existsSync(resultsPath) ? JSON.parse(readFileSync(resultsPath, 'utf8')) : null;
const pct = (m) => `${m.pct.toFixed(2)}% (${m.covered}/${m.total})`;

const lines = [];
lines.push(`# ${level[0].toUpperCase()}${level.slice(1)} test coverage`, '');
lines.push(`Generated: ${new Date().toISOString()}`, '');
lines.push(`Command: \`npm run test:${level}\``, '');
if (results) {
  lines.push('## Run', '');
  lines.push(`| Suites | Tests | Passed | Failed | Skipped |`, '|---|---|---|---|---|');
  lines.push(`| ${results.numTotalTestSuites} | ${results.numTotalTests} | ${results.numPassedTests} | ${results.numFailedTests} | ${results.numPendingTests + results.numTodoTests} |`, '');
  lines.push('### Test cases', '');
  for (const file of results.testResults) {
    lines.push(`**${relative(process.cwd(), file.name)}**`, '');
    for (const t of file.assertionResults) {
      const mark = t.status === 'passed' ? 'PASS' : t.status.toUpperCase();
      lines.push(`- ${mark}: ${[...t.ancestorTitles, t.title].join(' › ')}`);
    }
    lines.push('');
  }
}
lines.push('## Coverage (total)', '');
lines.push('| Metric | Coverage |', '|---|---|');
for (const k of ['lines', 'statements', 'functions', 'branches']) lines.push(`| ${k} | ${pct(summary.total[k])} |`);
lines.push('', '## Coverage per file', '');
lines.push('| File | Lines | Statements | Functions | Branches |', '|---|---|---|---|---|');
for (const [file, m] of Object.entries(summary)) {
  if (file === 'total') continue;
  lines.push(`| ${relative(process.cwd(), file)} | ${m.lines.pct}% | ${m.statements.pct}% | ${m.functions.pct}% | ${m.branches.pct}% |`);
}
writeFileSync(`test/${level}/evidence/coverage.md`, lines.join('\n') + '\n');
console.log(`wrote test/${level}/evidence/coverage.md`);

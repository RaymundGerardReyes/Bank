#!/usr/bin/env node

/**
 * Master E2E Test Suite Runner
 * Platform Domain Refactoring (F1 - F9)
 * Executes Tier 1 (Coverage), Tier 2 (Boundaries), Tier 3 (Cross-Feature), and Tier 4 (Real-World Scenarios)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTier1Suite } from './e2e-domain-refactoring/tier1-feature-coverage.test.mjs';
import { buildTier2Suite } from './e2e-domain-refactoring/tier2-boundary-cases.test.mjs';
import { buildTier3Suite } from './e2e-domain-refactoring/tier3-cross-feature.test.mjs';
import { buildTier4Suite } from './e2e-domain-refactoring/tier4-application-scenarios.test.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║   BANKING PLATFORM DOMAIN CONTRACTS E2E TEST SUITE (F1 - F9)        ║');
  console.log('║   4-Tier Opaque-Box Comprehensive Verification Engine                ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();
  const suites = [
    buildTier1Suite(),
    buildTier2Suite(),
    buildTier3Suite(),
    buildTier4Suite()
  ];

  const suiteReports = [];
  let grandTotal = 0;
  let grandPassed = 0;
  let grandFailed = 0;

  for (const suite of suites) {
    const report = await suite.run();
    suiteReports.push(report);
    grandTotal += report.total;
    grandPassed += report.passed;
    grandFailed += report.failed;
  }

  const grandDuration = Date.now() - startTime;

  // Print Summary Table
  console.log('\n======================================================================');
  console.log('🏆 4-TIER DOMAIN REFACTORING E2E EXECUTION SUMMARY');
  console.log('======================================================================');
  console.log('Tier Name                                     Total  Passed  Failed   Status');
  console.log('----------------------------------------------------------------------');
  for (const r of suiteReports) {
    const statusStr = r.failed === 0 ? '✅ PASS' : `❌ FAIL (${r.failed})`;
    const namePadded = r.suiteName.padEnd(45, ' ');
    const totalPadded = String(r.total).padStart(5, ' ');
    const passedPadded = String(r.passed).padStart(7, ' ');
    const failedPadded = String(r.failed).padStart(7, ' ');
    console.log(`${namePadded} ${totalPadded} ${passedPadded} ${failedPadded}   ${statusStr}`);
  }
  console.log('----------------------------------------------------------------------');
  const grandName = 'GRAND TOTAL'.padEnd(45, ' ');
  const gTotalPadded = String(grandTotal).padStart(5, ' ');
  const gPassedPadded = String(grandPassed).padStart(7, ' ');
  const gFailedPadded = String(grandFailed).padStart(7, ' ');
  const gStatus = grandFailed === 0 ? '✅ ALL PASSED' : `❌ ${grandFailed} FAILURES`;
  console.log(`${grandName} ${gTotalPadded} ${gPassedPadded} ${gFailedPadded}   ${gStatus}`);
  console.log(`Total Execution Time: ${grandDuration}ms`);
  console.log('======================================================================\n');

  // Write structured JSON report
  const resultsDir = path.resolve(__dirname, 'e2e-domain-refactoring', 'results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const jsonReportPath = path.join(resultsDir, 'domain-e2e-report.json');
  const jsonReport = {
    timestamp: new Date().toISOString(),
    durationMs: grandDuration,
    summary: {
      totalAssertions: grandTotal,
      passed: grandPassed,
      failed: grandFailed,
      status: grandFailed === 0 ? 'PASSED' : 'FAILED'
    },
    tiers: suiteReports
  };

  fs.writeFileSync(jsonReportPath, JSON.stringify(jsonReport, null, 2), 'utf8');
  console.log(`📄 Detailed JSON report written to: ${jsonReportPath}\n`);

  if (grandFailed > 0) {
    console.log(`⚠️  ${grandFailed} test(s) failed against the current codebase state.`);
    console.log('   These failures highlight features pending implementation in milestones M1, M2, or M3.');
    process.exit(1);
  } else {
    console.log('🎉 100% of domain contract E2E tests PASSED!');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal Test Runner Exception:', err);
  process.exit(1);
});

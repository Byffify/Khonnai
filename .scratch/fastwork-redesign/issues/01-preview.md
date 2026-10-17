# Baseline and shared visual preview

Status: done
Blocked by: none

Create three representative responsive views using synthetic labeled data, retain a fixed current receipt PNG and renderer/token identities, verify preview layout at320/390/768/1440, then present actual desktop/mobile captures for confirmation.

## Comments

- Scope follows the approved redesign plan. Production implementation waits for the shared-visual review, rather than treating an unshown mockup as approved.
- `npm.cmd test`:14 tests passed,0 failed (domain/storage baseline).
- `node.exe outputs/fastwork-preview/capture.cjs`:3 views×4 widths(320/390/768/1440), no horizontal document overflow, explicit size disclosure and reduced-motion check passed. Six final-state screenshots saved.
- Current receipt PNG retained at outputs/fastwork-preview/receipt-baseline.png; fixed fixture, PNG SHA-256 and renderer/token/source hashes stored in baseline.json. Actual local app renderer used, no real shop storage seeded or written.
- Mockup only: remaining navigation/actions are intentionally illustrative. No production UI/domain/storage/token changes made. Full keyboard/zoom/whole-app acceptance belongs to implementation verification task.

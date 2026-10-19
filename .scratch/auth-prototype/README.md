# Login visual prototype

Run from D:/Khonnai: npm.cmd run auth:prototype
Open http://127.0.0.1:5292/

Throwaway UI, no authentication backend. Use synthetic input only. No account is created and no recovery email is sent. State stays in memory and passwords clear on navigation/submission. Server CSP blocks network connections and native form submissions.

A is soft navy/orange light behind the card; B is a subtle edge glow. Both follow the same reference composition and design system. The lower review panel is only a prototype control, not intended application UI. Language selection does not change real app preferences.

Try Google/email, email validation, password/back/show-hide, signup and recovery. Simulated results are explicitly labeled. None verifies actual credentials, provider throttling, email ownership, RLS or transaction security.

Evidence: outputs/auth-prototype/verification.json and final screenshots. Checks exercised both languages, four widths, email syntax/plus/trim, empty password, short signup password, back, clearing password, a simulated credential error, recovery preview, zoom200 and reduced motion. They did not exercise every simulated option or a complete keyboard-only journey. Eight protected source files match the captured baseline.

Current gate: user reviews visual direction before real Supabase connection. Full plan: .scratch/supabase-auth/plan.md. External setup: docs/research/supabase-staging-setup.md.

Follow-up: email registration and password setup are separate screens. Setup contains password, confirmation and four live checks:8 code points, at least one ASCII letter, at least one ASCII digit, and exact confirmation match. This limited client checklist is not a compromised-password blocklist or a claim of NIST compliance. Mirror the accepted policy server-side during real integration.

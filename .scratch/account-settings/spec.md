# Account settings and Auth button spacing

User requests separation between signed-in Auth actions and Settings showing the current email with password change. They subsequently confirm the website loading bug no longer occurs, so no speculative loading change is authorized or needed.

Reuse the existing Auth action grid for button spacing. Add an account category to cloud Settings only, with read-only authenticated email and a button requesting the existing verified-email password recovery flow. Do not permit password changes from an unverified settings form, reveal account existence, or change shop/local demo/landing/receipt behavior. Password reset remains on the existing confirmation/reset screens with four live checks.

Account action shape: account email plus sendPasswordReset():Promise<void>, supplied through App's cloud client; the client verifies the current session, obtains bootstrap CSRF and calls the existing recover route using that session's email. Confirm current identity before sending so a changed account cannot reuse the old Settings action. The UI reports safe states, blocks repeated clicks and remains bilingual. No passwords or tokens in URLs except the existing verified email-link protocol.

Verification: unit tests for account-bound reset, missing/changed identity, CSRF and failure handling; browser checks for spacing, email, sending state and no app/local mutations; existing reset browser flow remains applicable. No production deployment.

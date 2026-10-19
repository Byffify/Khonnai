-- Auth's authenticated /user endpoint checks that session_id still exists.
-- The BFF verifies it on every protected request and needs no auth schema access.
revoke select (id, user_id, not_after) on auth.sessions from khonnai_vault_runtime;
revoke usage on schema auth from khonnai_vault_runtime;

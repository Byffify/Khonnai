# Report an occupied staging project without running Auth fixtures

The live Auth fixture verifier requires an empty project. With one real account it currently reports a generic configuration assertion and replaces its verification artifact despite running no checks.

Keep the empty-project guard. Report this condition as not_run, exit nonzero, and write a separate attempt artifact without overwriting the last executed verification. Never delete existing accounts to satisfy the guard. Document the real-account manual test path separately from disposable-project fixture tests.

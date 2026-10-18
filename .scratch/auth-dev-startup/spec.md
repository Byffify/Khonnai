# Re-enter local Auth development without a port collision

The user ran npm.cmd run auth:dev while the helper started by this chat was already listening on5293/5294. The launcher spawned a second API, which failed with an uninformative error.

The launcher must recognize both existing Khonnai services, print the Auth URL and exit successfully without starting children. An occupied foreign or partially running service must produce a clear port message without stopping processes. Direct API bind errors must identify the port and safe error category without revealing configuration.

Service inspection uses a dev-only response marker, fresh HTTP connections and bounded timeouts. No business/Auth protocol or local shop data changes.

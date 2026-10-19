# Import local shop data without deletion

Status: wontfix
Blocked by: none

## Acceptance
Preview, empty target, import receipt, retry, unchanged local original.

## Comments
Not yet complete. Dependent gates remain in force.

18 October2026: superseded by the user's explicit decision to start Supabase shops at zero because localStorage contains only demo data. Do not automatically import or delete local records. This is a scope removal, not a completed import implementation. Local /app backup/restore remains unchanged; cloud backup export is available, cloud restore is not implemented.

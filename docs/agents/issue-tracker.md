# Issue tracker: Local Markdown

- Specs live in `.scratch/<feature>/spec.md`.
- Tasks live in `.scratch/<feature>/issues/<NN>-<slug>.md`, one file per task.
- Each task declares `Status` and `Blocked by` near the top.
- Number tasks in dependency order, with blockers first.
- A task may start when all its blockers are complete.
- Record completion with `Status: done` and append verification evidence under `## Comments`.
- Append progress and discussion under `## Comments` in the task file.
- To publish a spec or task, create its file in this layout.
- To fetch a spec or task, read the referenced file.

See `triage-labels.md` for triage statuses.

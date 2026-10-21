# CASEFILE — Project Status and Handoff

## Purpose

This is the pre-implementation handoff for CASEFILE — Digital Crime Scene. It records the intended product and the safe starting point for implementation.

## Confirmed product goals

- MERN stack: React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and Mongoose.
- Interactive Evidence Board with movable evidence cards, labeled relationships, notes/groups as finalized in the board contract, and persistent save/restore.
- Persistent investigations, evidence discoveries, hypotheses, conclusion submissions, and score breakdowns.
- Deterministic scoring performed by the server.
- Registration, login, logout, profiles, investigation history, achievements, statistics, and privacy-aware leaderboard.
- Admin-only case management and publishing.
- Ten initial cases: six researched historical cases and four fictional cases.
- Validation, authorization, automated tests, security hardening, and reproducible setup instructions.

## Status based on supplied artifacts

**Documentation exists. Application implementation is not verified.**

The supplied ZIP contains planning documents: PRD, architecture, schema, API outline, case content guide, security plan, test plan, roadmap, repository structure, and MVP backlog. It does not establish that a runnable client/server repository exists or that any feature has been implemented, tested, or deployed.

Do not describe a feature as complete until code inspection and a reproducible test support that claim.

## First actions

1. Locate and inspect the actual application repository, if one exists.
2. Record the current Git branch, working tree, files, package manifests, scripts, environment examples, and tests.
3. Do not overwrite existing code or regenerate the repository before inspecting it.
4. Resolve P0 items in `11_DECISION_LOG.md`.
5. Approve the scoring contract before implementing scoring.
6. Establish a minimal client/server foundation and a health endpoint.
7. Build one complete investigation vertical slice and test it end to end.

## First vertical slice

Register/login → browse a published case → start/resume investigation → discover evidence → edit and save Evidence Board → submit hypothesis/conclusion → calculate score on server → persist result → view history.

## Status vocabulary

Use only:
- **Not started** — no implementation evidence.
- **In progress** — implementation exists but acceptance checks are incomplete.
- **Implemented, unverified** — code exists, but a repeatable test has not passed.
- **Verified** — named checks passed in the current environment.
- **Blocked** — a stated dependency or decision prevents progress.

Record the date, commit or file reference, test command, and result when changing a feature to Verified.

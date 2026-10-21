# CASEFILE — Digital Crime Scene

CASEFILE is a MERN-based interactive crime and mystery investigation platform. Its core experience is a persistent, interactive Evidence Board backed by server-authoritative detective scoring.

## Before implementation

1. Read `docs/00_PROJECT_STATUS_AND_HANDOFF.md`.
2. Read the original requirements and design documents listed below.
3. Resolve the P0 items in `docs/11_DECISION_LOG.md`.
4. Review `docs/12_SCORING_CONTRACT.md` and approve the scoring rules before coding the scoring service.
5. Use `docs/13_ACCEPTANCE_CRITERIA.md` to define a working feature, not merely a rendered screen.
6. Inspect the actual repository before creating or overwriting application code.

## Documentation index

- `docs/01_PRD.md` — product requirements
- `docs/02_SYSTEM_ARCHITECTURE.md` — system architecture
- `docs/03_DATABASE_SCHEMA.md` — database design
- `docs/04_API_SPEC.md` — REST API outline
- `docs/05_CASE_CONTENT_GUIDE.md` — case content requirements
- `docs/06_SECURITY_PRIVACY.md` — security and privacy baseline
- `docs/07_TEST_PLAN.md` — test plan
- `docs/08_IMPLEMENTATION_ROADMAP.md` — implementation phases
- `docs/09_REPOSITORY_STRUCTURE.md` — suggested repository layout
- `docs/10_MVP_BACKLOG.md` — MVP backlog
- `docs/00_PROJECT_STATUS_AND_HANDOFF.md` — status and starting instructions
- `docs/11_DECISION_LOG.md` — unresolved decisions and defaults
- `docs/12_SCORING_CONTRACT.md` — scoring contract draft
- `docs/13_ACCEPTANCE_CRITERIA.md` — end-to-end acceptance criteria

## Core implementation principle

Build one complete investigation vertical slice before expanding the whole platform:

`Authentication → Case → Investigation → Evidence → Evidence Board → Conclusion → Server score → History`

## Important

These files describe the intended product and planned behavior. They do not prove that implementation, testing, or deployment has occurred. Update status only when supported by repository inspection or test evidence.

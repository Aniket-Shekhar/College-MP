# CASEFILE — MVP Acceptance Criteria

A feature is not complete because its screen renders. It must satisfy its relevant persistence, authorization, error, and test requirements.

## Foundation
- Client and server install from documented commands.
- Environment variables are documented; real secrets are not committed.
- Server starts with valid configuration and reports a useful failure for invalid configuration.
- MongoDB connectivity is verified.
- `/api/v1/health` (or the agreed health route) reports service status without leaking secrets.
- Lint/test scripts are documented and run successfully.

## Authentication and authorization
- Registration validates input and securely hashes passwords.
- Login/logout and current-user retrieval work.
- Protected routes reject unauthenticated requests.
- User A cannot read or modify User B's investigations by changing IDs.
- Admin APIs reject non-admin users.
- Authentication endpoints have reasonable rate limiting and safe error messages.

## Cases and content
- Published case listing supports documented filters and pagination.
- Public case detail omits solution keys, hidden unlock rules, and private scoring data.
- Unpublished cases are not exposed to ordinary users.
- Each published case passes a content completeness validator.
- Historical case claims have source metadata and review status.

## Investigation and persistence
- A user can start and resume an investigation.
- Evidence discovery is recorded once and survives refresh/relogin.
- Board nodes, edges, labels, and notes save and restore without loss.
- Invalid, oversized, cross-case, and unauthorized payloads are rejected.
- Autosave failure is visible and does not falsely indicate that data was saved.

## Conclusion and scoring
- User submits a supported conclusion and reasoning.
- Server computes component and final scores using a versioned rubric.
- Client-provided scores are never trusted.
- Repeated submission follows the documented idempotency/replay policy.
- Score breakdown and completion state persist and appear in history.

## Profiles and achievements
- Profile statistics are derived from authoritative investigation records.
- History is scoped to the authenticated user.
- Achievement unlocks are deterministic and do not duplicate.
- Leaderboard respects each user's visibility setting and does not expose private account data.

## Ten initial cases
- Exactly ten initial cases are published for the initial release.
- Six are researched historical cases and four are fictional.
- Each case has validated content, playable discovery rules, conclusion criteria, scoring configuration, and appropriate sources/editorial notes.
- Each case can be completed through the UI and API without manual database edits.

## Release evidence
For each acceptance run, record date, commit, environment, command, result, and any known limitation. Do not mark an item Verified without reproducible evidence.
